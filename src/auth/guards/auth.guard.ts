import {
  ExecutionContext,
  Injectable,
  UnauthorizedException
} from "@nestjs/common"
import { GqlExecutionContext } from "@nestjs/graphql"
import { AuthGuard } from "@nestjs/passport"

@Injectable()
export class GqlAuthGuard extends AuthGuard("jwt") {
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context)

    return ctx.getContext().req
  }
}

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context)
  }

  handleRequest(err, user, info) {
    if (err || !user) {
      throw err || new UnauthorizedException()
    }
    return user
  }
}
