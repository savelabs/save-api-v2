import { Injectable } from "@nestjs/common"
import { Cron } from "@nestjs/schedule"
import { Queue } from "bull"
import { UsersService } from "src/users/users.service"

@Injectable()
export class NotificationsService {
  constructor(
    private readonly usersService: UsersService,
    private queue: Queue
  ) {}

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
