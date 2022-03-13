import { Module } from "@nestjs/common"
import { AuthService } from "./auth.service"
import { AuthResolver } from "./auth.resolver"
import { JwtStrategy } from "./jwt.strategy"
import { TokensModule } from "src/tokens/tokens.module"
import { UsersModule } from "src/users/users.module"

@Module({
  imports: [UsersModule, TokensModule],
  providers: [AuthService, AuthResolver, JwtStrategy]
})
export class AuthModule {}
