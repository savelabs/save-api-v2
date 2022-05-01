import { Injectable } from "@nestjs/common"
import { Cron } from "@nestjs/schedule"
import { Queue } from "bull"
import { UsersService } from "src/users/users.service"
import { AuthService } from "src/auth/auth.service"
import { User } from "src/users/entities/user.entity"
import { InjectQueue } from "@nestjs/bull"
import Expo from "expo-server-sdk"

@Injectable()
export class NotificationsService {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    @InjectQueue("notifications") private queue: Queue
  ) {}

  async enableNotifications(user: User, password: string) {
    await this.usersService.enableNotifications(user.id)

    const { apiToken } = await this.authService.validateUser({
      matriculation: user.matriculation,
      password
    })

    await this.usersService.updateApiToken(user.id, apiToken)
    await this.usersService.updatePassword(user.id, password)
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
          user: user
        }
      })
      if (user.showNotifications) {
        notificationEvents.push({
          name: "notification",
          user: user
        })
      }
    })

    await this.queue.addBulk(tokensEvents)
    await this.queue.addBulk(notificationEvents)
  }

  async sendExpoNotifications(title: string, message: string) {
    const users = await this.usersService.getActiveUsers()

    const tokens = []

    users.forEach((user) => {
      if (user.showNotifications) {
        tokens.push(...user.expoPushTokens)
      }
    })

    const chunks = Expo.chunkPushNotifications(tokens)

    const messages = []

    chunks.forEach((chunk) => {
      messages.push({
        to: chunk,
        sound: "default",
        title: title,
        body: message
      })
    })

    await this.queue.add({
      name: "expoNotification",
      chunk: messages
    })
  }
}
