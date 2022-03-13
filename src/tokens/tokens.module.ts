import { CacheModule, Module } from "@nestjs/common"
import { TokensService } from "./tokens.service"
import { TokensResolver } from "./tokens.resolver"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { JwtModule } from "@nestjs/jwt"
import * as redisStore from "cache-manager-redis-store"

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>("jwt.secret"),
        signOptions: { expiresIn: "300s" }
      }),
      inject: [ConfigService]
    }),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        store: redisStore,
        host: configService.get<string>("redis.host"),
        port: configService.get<number>("redis.port")
      }),
      inject: [ConfigService]
    })
  ],
  providers: [TokensResolver, TokensService],
  exports: [TokensService]
})
export class TokensModule {}
