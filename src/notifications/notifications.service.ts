import { Injectable } from "@nestjs/common"
import { Cron } from "@nestjs/schedule"
import { Queue } from "bull"
import { UsersService } from "src/users/users.service"
import vault from "node-vault"
import { AuthService } from "src/auth/auth.service"
import { User } from "src/users/entities/user.entity"
import { InjectQueue } from "@nestjs/bull"

@Injectable()
export class NotificationsService {
  private vaultClient: vault.client

  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    @InjectQueue("notifications") private queue: Queue
  ) {
    this.vaultClient = vault({
      apiVersion: "v1",
      endpoint: "http://127.0.0.1:8200"
    })

    this.vaultClient
      .approleLogin({
        role_id: "3eab5fb7-389a-efe1-ff7c-d1f45acaac3c",
        secret_id: "4200379d-9c2d-52a3-c4be-a65c54def7e0"
      })
      .then((result: any) => {
        this.vaultClient.token = result.auth.client_token
      })
  }

  async enableNotifications(user: User, password: string) {
    await this.usersService.enableNotifications(user.id)

    const { apiToken } = await this.authService.validateUser({
      matriculation: user.matriculation,
      password
    })

    await this.vaultClient.write(`secret/suap/${user.id}`, {
      apiToken,
      password
    })
  }

  @Cron("* 0 */8 * *")
  async sendNotifications() {
    const users = await this.usersService.getActiveUsers()

    users.forEach(async (user) => {
      await this.queue.add("token", { userId: user.id })
      if (user.showNotifications) {
        await this.queue.add("notifications", {
          userId: user.id,
          lastInfo: user.lastInfo,
          expoPushTokens: user.expoPushTokens
        })
      }
    })
  }
}
