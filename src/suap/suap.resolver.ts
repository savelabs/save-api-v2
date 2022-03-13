import { Args, Mutation, Resolver } from "@nestjs/graphql"
import { Credentials } from "src/auth/decorators/credentials"
import { JSONScalar } from "src/scalars"
import { Credenciais } from "suap-sdk-javascript"
import { SuapRequestInput } from "./dto/request"
import { SuapService } from "./suap.service"

@Resolver()
export class SuapResolver {
  constructor(private readonly suapService: SuapService) {}

  @Mutation(() => JSONScalar)
  async suap(
    @Args("data") data: SuapRequestInput,
    @Credentials() credentials: Credenciais
  ) {
    return await this.suapService.request(
      credentials,
      data.requestName,
      data.parameters
    )
  }
}
