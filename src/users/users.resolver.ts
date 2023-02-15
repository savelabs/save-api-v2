import { Resolver, Query, Mutation, Args } from "@nestjs/graphql"
import { User } from "./entities/user.entity"
import { UseGuards } from "@nestjs/common"
import { GqlAuthGuard } from "../auth/guards/auth.guard"
import { CurrentUser } from "../auth/decorators/currentUser"
import { UsersService } from "./users.service"
import { RolesGuard } from "src/auth/guards/roles.guard"
import { Roles } from "src/auth/decorators/roles"

@Resolver(() => User)
export class UsersResolver {
  constructor(private usersService: UsersService) {}

  @Query(() => User)
  @UseGuards(GqlAuthGuard)
  async me(@CurrentUser() user: User): Promise<User> {
    return user
  }

  @Mutation(() => String)
  @UseGuards(GqlAuthGuard)
  async uploadPhoto(
    @Args("file") file: string,
    @Args("extension") extension: string,
    @CurrentUser() user: User
  ) {
    return await this.usersService.updatePhoto(user.id, file, extension)
  }

  @Query(() => Number)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles("ADMIN")
  async usersCount(): Promise<number> {
    return await this.usersService.getUsersCount()
  }
}
