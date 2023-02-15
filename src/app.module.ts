import { Module } from "@nestjs/common"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { GraphQLModule } from "@nestjs/graphql"
import {} from "@nestjs/mercurius"
import { MercuriusDriver, MercuriusDriverConfig } from "@nestjs/mercurius"
import { ThrottlerModule } from "@nestjs/throttler"
import config from "../config"
import * as Joi from "joi"
import { UsersModule } from "./users/users.module"
import { AuthModule } from "./auth/auth.module"
import { TokensModule } from "./tokens/tokens.module"
import {
  DateTimeScalar,
  JSONScalar,
  JWTScalar,
  UUIDScalar,
  VoidScalar
} from "./scalars"
import { SuapModule } from "./suap/suap.module"
import { TicketsModule } from "./tickets/tickets.module"
import { NotificationsModule } from "./notifications/notifications.module"
import { BullModule } from "@nestjs/bull"
import { ScheduleModule } from "@nestjs/schedule"
import { FilesModule } from "./files/files.module"

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [config],
      validationSchema: Joi.object({
        throttle: Joi.object({
          ttl: Joi.number().integer().min(1).required(),
          limit: Joi.number().integer().min(1).required()
        }),
        refresh_token: Joi.object({
          expiration_time: Joi.number().integer().min(1).required()
        }),
        jwt: Joi.object({
          secret: Joi.string().required()
        }),
        redis: Joi.object({
          host: Joi.string().required(),
          port: Joi.number().integer().min(1).required(),
          password: Joi.string().required()
        })
      })
    }),
    GraphQLModule.forRoot<MercuriusDriverConfig>({
      driver: MercuriusDriver,
      autoSchemaFile: true,
      graphiql: true
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        ttl: config.get("throttle.ttl"),
        limit: config.get("throttle.limit")
      })
    }),
    BullModule.forRoot({
      redis: {
        host: "redis",
        port: 6379
      }
    }),
    ScheduleModule.forRoot(),
    UsersModule,
    AuthModule,
    TokensModule,
    SuapModule,
    NotificationsModule,
    TicketsModule,
    FilesModule
  ],
  providers: [VoidScalar, JWTScalar, UUIDScalar, JSONScalar, DateTimeScalar]
})
export class AppModule {}
