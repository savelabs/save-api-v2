import { Processor, Process, OnQueueDrained, InjectQueue } from "@nestjs/bull"
import { User } from "@prisma/client"
import { Job, Queue } from "bull"
import { SuapService } from "src/suap/suap.service"
import { ConfigService } from "@nestjs/config"
import { Expo, ExpoPushMessage } from "expo-server-sdk"
import { UsersService } from "src/users/users.service"

@Processor("token")
export class AudioConsumer {
  private notificationMessages = []
  private expo: Expo

  constructor(
    private suapService: SuapService,
    private configService: ConfigService,
    private usersService: UsersService,
    @InjectQueue("notifications") private readonly queue: Queue
  ) {
    this.expo = new Expo({
      accessToken: this.configService.get<string>("expo.access_token")
    })
  }

  @Process("token")
  async revokeToken(job: Job<{ user: User }>) {
    const { user } = job.data
    const data = await this.usersService.getCredentials(user.id)
    const newToken = await this.suapService.request(
      { api: data.suapApiToken, matricula: user.matriculation },
      "renovarToken",
      []
    )
    await this.usersService.updateApiToken(user.id, newToken)
  }

  @Process("notification")
  async sendNotifications(job: Job<{ user: User }>) {
    const { user } = job.data
    const { suapApiToken } = await this.usersService.getCredentials(user.id)
    await this.suapService.request(
      {
        api: suapApiToken,
        matricula: user.matriculation
      },
      "notificar",
      []
    )
    this.notificationMessages.push({})
  }

  @Process("expoNotification")
  async sendExpoNotifications(job: Job<{ chunk: ExpoPushMessage[] }>) {
    const { chunk } = job.data
    await this.expo.sendPushNotificationsAsync(chunk)
  }

  @OnQueueDrained({ name: "notifications" })
  async onQueueDrained() {
    const chunks = this.expo.chunkPushNotifications(this.notificationMessages)

    await this.queue.addBulk(
      chunks.map((chunk) => {
        return {
          name: "expoNotification",
          data: {
            chunk
          }
        }
      })
    )

    this.notificationMessages = []
  }
}
