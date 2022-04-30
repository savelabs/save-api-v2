import { Injectable, UnauthorizedException } from "@nestjs/common"
import { UsersService } from "../users/users.service"
import { AuthInput } from "./dto/auth.input"
import { AuthType } from "./entities/auth.type"
import { TokensService } from "../tokens/tokens.service"
import { ClienteSuap } from "suap-sdk"

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly tokensService: TokensService
  ) {}

  async validateUser(data: AuthInput): Promise<AuthType> {
    const cliente = new ClienteSuap()

    try {
      await cliente.login(data.matriculation, data.password)
    } catch {
      throw new UnauthorizedException("Matrícula ou senha inválidos")
    }

    const user =
      (await this.usersService.getByMatriculation(data.matriculation)) ||
      (await this.usersService.create({
        ...data,
        expoPushTokens: []
      }))

    const token = await this.tokensService.generateJWTToken(user.id)

    const refreshToken = await this.tokensService.create(user.id)

    const { api, site } = await cliente.obterCredenciais()

    return { user, token, refreshToken, apiToken: api, cookies: site }
  }
}
