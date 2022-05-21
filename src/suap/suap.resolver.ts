import { UseGuards } from "@nestjs/common"
import { Args, Mutation, Resolver } from "@nestjs/graphql"
import { GqlAuthGuard } from "src/auth/guards/auth.guard"
import { SuapCookies } from "src/auth/decorators/credentials"
import { CurrentUser } from "src/auth/decorators/currentUser"
import { JSONScalar } from "src/scalars"
import { User } from "src/users/entities/user.entity"
import { SuapRequestInput } from "./dto/request"
import { SuapService } from "./suap.service"

@Resolver()
export class SuapResolver {
  constructor(private readonly suapService: SuapService) {}

  @Mutation(() => JSONScalar)
  @UseGuards(GqlAuthGuard)
  async suap(
    @CurrentUser() user: User,
    @Args("data") data: SuapRequestInput,
    @SuapCookies() suapCookies: string
  ) {
    return await this.suapService.request(
      {
        api: "",
        site: suapCookies,
        matricula: user.matriculation
      },
      data.requestName,
      data.parameters
    )
  }
}
