import { Processor, Process, OnQueueDrained, InjectQueue } from "@nestjs/bull"
import { Job, Queue } from "bull"
import { ConfigService } from "@nestjs/config"
import { Expo, ExpoPushMessage } from "expo-server-sdk"

@Processor("token")
export class AudioConsumer {
  private notificationMessages = []
  private expo: Expo

  constructor(
    private configService: ConfigService,
    @InjectQueue("notifications") private readonly queue: Queue
  ) {
    this.expo = new Expo({
      accessToken: this.configService.get<string>("expo.access_token")
    })
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
