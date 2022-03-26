import { createParamDecorator, ExecutionContext } from "@nestjs/common"
import { GqlExecutionContext } from "@nestjs/graphql"

export const Credentials = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context)
    const credentials = {
      site: ctx.getContext().req.headers["suap-cookies"]
    }

    return credentials
  }
)
