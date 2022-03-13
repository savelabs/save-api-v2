import { createParamDecorator, ExecutionContext } from "@nestjs/common"
import { GqlExecutionContext } from "@nestjs/graphql"

export const Credentials = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context)
    const http_ctx = ctx.getContext()
    const credentials = {}
    credentials["api"] = http_ctx.req.headers["suap-api-token"]
    credentials["site"] = http_ctx.req.headers["suap-site-cookies"]

    return credentials
  }
)
