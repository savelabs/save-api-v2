import { Module } from "@nestjs/common"
import { NotificationsService } from "./notifications.service"
import { NotificationsResolver } from "./notifications.resolver"
import { UsersModule } from "src/users/users.module"
import { AuthModule } from "src/auth/auth.module"
import { BullModule } from "@nestjs/bull"
import { VaultService } from "src/vault.service"

@Module({
  imports: [
    UsersModule,
    AuthModule,
    BullModule.registerQueue({ name: "tokens" }),
    BullModule.registerQueue({ name: "notifications" })
  ],
  providers: [NotificationsResolver, NotificationsService, VaultService]
})
export class NotificationsModule {}
