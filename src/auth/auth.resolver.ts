import { Args, Mutation, Resolver } from "@nestjs/graphql"
import { AuthService } from "./auth.service"
import { AuthInput } from "./dto/auth.input"
import { AuthType } from "./entities/auth.type"

@Resolver(() => AuthType)
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => AuthType)
  public async login(@Args("data") data: AuthInput): Promise<AuthType> {
    const response = await this.authService.validateUser(data)

    return response
  }
}
