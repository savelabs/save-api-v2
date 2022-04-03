import { UseGuards } from "@nestjs/common"
import { Args, Mutation, Resolver } from "@nestjs/graphql"
import { GqlAuthGuard } from "src/auth/auth.guard"
import { CurrentUser } from "src/auth/decorators/currentUser"
import { VoidScalar } from "src/scalars"
import { User } from "src/users/entities/user.entity"
import { NotificationsService } from "./notifications.service"

@Resolver()
export class NotificationsResolver {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Mutation(() => VoidScalar, { nullable: true })
  @UseGuards(GqlAuthGuard)
  async enableNotifications(
    @CurrentUser() user: User,
    @Args("password") password: string
  ) {
    return await this.notificationsService.enableNotifications(user, password)
  }
}
