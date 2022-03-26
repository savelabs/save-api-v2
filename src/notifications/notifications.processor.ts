import { Processor, Process } from "@nestjs/bull"
import { User } from "@prisma/client"
import { Job } from "bull"
import { SuapService } from "src/suap/suap.service"

@Processor("notificationsQueue")
export class AudioConsumer {
  constructor(private suapService: SuapService) {}

  @Process("token")
  async revokeToken(job: Job<{ userId: User["id"] }>) {
    job.data
  }
}
