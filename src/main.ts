import { NestFactory } from "@nestjs/core"
import {
  FastifyAdapter,
  NestFastifyApplication
} from "@nestjs/platform-fastify"
import { AppModule } from "./app.module"
import { fastifyHelmet } from "fastify-helmet"

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter()
  )
  await app.register(fastifyHelmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: [`'self'`],
        styleSrc: [
          `'self'`,
          `'unsafe-inline'`,
          "cdn.jsdelivr.net",
          "fonts.googleapis.com"
        ],
        fontSrc: [`'self'`, "fonts.gstatic.com"],
        imgSrc: [`'self'`, "data:", "cdn.jsdelivr.net"],
        scriptSrc: [`'self'`, `https: 'unsafe-inline'`, `cdn.jsdelivr.net`]
      }
    }
  })
  await app.listen(8000)
}
bootstrap()
