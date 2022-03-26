import { Module } from "@nestjs/common"
import { NotificationsService } from "./notifications.service"
import { NotificationsResolver } from "./notifications.resolver"
import { UsersModule } from "src/users/users.module"

@Module({
  imports: [UsersModule],
  providers: [NotificationsResolver, NotificationsService]
})
export class NotificationsModule {}
