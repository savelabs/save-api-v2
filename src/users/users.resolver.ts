import { Resolver, Query } from "@nestjs/graphql"
import { User } from "./entities/user.entity"
import { UseGuards } from "@nestjs/common"
import { GqlAuthGuard } from "../auth/auth.guard"
import { CurrentUser } from "../auth/decorators/currentUser"

@Resolver(() => User)
export class UsersResolver {
  @Query(() => User)
  @UseGuards(GqlAuthGuard)
  async me(@CurrentUser() user: User): Promise<User> {
    return user
  }
}
