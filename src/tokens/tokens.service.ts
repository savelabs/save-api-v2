import {
  CACHE_MANAGER,
  Inject,
  Injectable,
  UnauthorizedException
} from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { JwtService } from "@nestjs/jwt"
import { Cache } from "cache-manager"
import { randomUUID } from "crypto"

@Injectable()
export class TokensService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache
  ) {}

  async validate(token: string, refreshToken: string) {
    const { sub: userId } = await this.jwtService.verifyAsync<{ sub: string }>(
      token,
      { ignoreExpiration: true }
    )

    const tokenValue = await this.cacheManager.get<string>(
      `${userId}:${refreshToken}`
    )

    if (tokenValue !== "") {
      throw new UnauthorizedException("Refresh token inválido ou expirado")
    }

    return userId
  }

  async create(userId: string) {
    const expiration_time = this.configService.get<number>(
      "refresh_token.expiration_time"
    )
    const refreshToken = randomUUID()

    await this.cacheManager.set(`${userId}:${refreshToken}`, "", {
      ttl: expiration_time
    })

    return refreshToken
  }

  async revoke(userId: string, refreshToken: string) {
    await this.cacheManager.del(`${userId}:${refreshToken}`)
  }

  async generateToken(token: string, refreshToken: string) {
    const userId = await this.validate(token, refreshToken)

    const newToken = await this.generateJWTToken(userId)

    const expiration_time = this.configService.get<number>(
      "refresh_token.expiration_time"
    )
    await this.cacheManager.set(`${userId}:${refreshToken}`, "", {
      ttl: expiration_time
    })

    return newToken
  }

  async generateJWTToken(userId: string) {
    const token = await this.jwtService.signAsync({ sub: userId })

    return token
  }
}
