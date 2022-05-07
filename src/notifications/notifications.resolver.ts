import { UseGuards } from "@nestjs/common"
import { Args, Mutation, Resolver } from "@nestjs/graphql"
import { GqlAuthGuard } from "src/auth/auth.guard"
import { CurrentUser } from "src/auth/decorators/currentUser"
import { Roles } from "src/auth/decorators/roles"
import { RolesGuard } from "src/auth/guards/roles.guard"
import { VoidScalar } from "src/scalars"
import { User } from "src/users/entities/user.entity"
import { NotificationsService } from "./notifications.service"

@Resolver()
export class NotificationsResolver {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Mutation(() => VoidScalar)
  @UseGuards(GqlAuthGuard)
  async enableNotifications(
    @CurrentUser() user: User,
    @Args("password") password: string
  ) {
    await this.notificationsService.enableNotifications(user, password)
  }

  @Mutation(() => VoidScalar)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles("ADMIN")
  async sendNotification(
    @Args("title") title: string,
    @Args("body") body: string,
  ) {
    await this.notificationsService.sendExpoNotifications(title, body)
  }
}
