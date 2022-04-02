import { Injectable, UnauthorizedException } from "@nestjs/common"
import { UsersService } from "../users/users.service"
import { AuthInput } from "./dto/auth.input"
import { AuthType } from "./entities/auth.type"
import { TokensService } from "../tokens/tokens.service"
import { ClienteSuap } from "suap-sdk-javascript"
import vault from "node-vault"

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

    const vaultClient = vault({
      apiVersion: "v1",
      endpoint: "http://127.0.0.1:8200"
    })

    const result = await vaultClient.approleLogin({
      role_id: "3eab5fb7-389a-efe1-ff7c-d1f45acaac3c",
      secret_id: "4200379d-9c2d-52a3-c4be-a65c54def7e0"
    })

    vaultClient.token = result.auth.client_token

    await vaultClient.write(`secret/suap/${user.id}`, {
      api,
      password: data.password
    })

    return { user, token, refreshToken, cookies: site }
  }
}
