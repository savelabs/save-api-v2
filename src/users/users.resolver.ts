import { Resolver, Query, Mutation, Args } from "@nestjs/graphql"
import { User } from "./entities/user.entity"
import { UseGuards } from "@nestjs/common"
import { GqlAuthGuard } from "../auth/auth.guard"
import { CurrentUser } from "../auth/decorators/currentUser"
import { GraphQLUpload, FileUpload } from "graphql-upload"
import { UsersService } from "./users.service"

@Resolver(() => User)
export class UsersResolver {
  constructor(private usersService: UsersService) {}

  @Query(() => User)
  @UseGuards(GqlAuthGuard)
  async me(@CurrentUser() user: User): Promise<User> {
    return user
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async uploadPhoto(
    @Args({ name: "file", type: () => GraphQLUpload })
    { createReadStream, filename }: FileUpload,
    @CurrentUser() user: User
  ): Promise<boolean> {
    return await this.usersService.updatePhoto(
      user.id,
      createReadStream,
      filename.split(".").pop()
    )
  }
}
