import { Module } from "@nestjs/common"
import { TicketsService } from "./tickets.service"
import { TicketsResolver } from "./tickets.resolver"
import { PrismaService } from "src/prisma.service"

@Module({
  providers: [TicketsResolver, TicketsService, PrismaService]
})
export class TicketsModule {}
