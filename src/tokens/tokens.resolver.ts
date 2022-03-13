import { Args, Mutation, Resolver } from "@nestjs/graphql"
import { JWTScalar } from "src/scalars"
import { TokensService } from "./tokens.service"

@Resolver()
export class TokensResolver {
  constructor(private readonly tokensService: TokensService) {}

  @Mutation(() => JWTScalar)
  async refreshToken(
    @Args("token", { type: () => String }) token: string,
    @Args("refreshToken", { type: () => String }) refreshToken: string
  ) {
    return await this.tokensService.generateToken(token, refreshToken)
  }
}
