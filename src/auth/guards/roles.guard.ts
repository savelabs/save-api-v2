import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common"
import { Reflector } from "@nestjs/core"
import { GqlExecutionContext } from "@nestjs/graphql"

function arrayContainsArray(superset: any[], subset: any[]): boolean {
  if (0 === subset.length) {
    return false
  }
  return subset.every(function (value) {
    return superset.indexOf(value) >= 0
  })
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>("roles", context.getHandler())

    if (!roles) {
      return true
    }

    const user = GqlExecutionContext.create(context).getContext().req.user

    return arrayContainsArray(user.roles, roles)
  }
}
