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
  await app.register(fastifyHelmet)
  await app.listen(8000)
}
bootstrap()
