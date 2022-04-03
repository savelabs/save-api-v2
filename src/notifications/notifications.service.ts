import { Injectable } from "@nestjs/common"
import { Cron } from "@nestjs/schedule"
import { Queue } from "bull"
import { UsersService } from "src/users/users.service"
import { AuthService } from "src/auth/auth.service"
import { User } from "src/users/entities/user.entity"
import { InjectQueue } from "@nestjs/bull"
import { VaultService } from "src/vault.service"

@Injectable()
export class NotificationsService {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly vaultService: VaultService,
    @InjectQueue("notifications") private queue: Queue
  ) {}

  async enableNotifications(user: User, password: string) {
    await this.usersService.enableNotifications(user.id)

    const { apiToken } = await this.authService.validateUser({
      matriculation: user.matriculation,
      password
    })

    await this.vaultService.client.write(`secret/suap/${user.id}`, {
      apiToken,
      password
    })
  }

  @Cron("* 0 */8 * *")
  async sendNotifications() {
    const users = await this.usersService.getActiveUsers()

    const tokensEvents = []
    const notificationEvents = []

    users.forEach(async (user) => {
      tokensEvents.push({
        name: "token",
        data: {
          user: user,
          vaultClient: this.vaultService.client
        }
      })
      if (user.showNotifications) {
        notificationEvents.push({
          name: "notification",
          user: user,
          vaultClient: this.vaultService.client
        })
      }
    })

    await this.queue.addBulk(tokensEvents)
    await this.queue.addBulk(notificationEvents)
  }
}
