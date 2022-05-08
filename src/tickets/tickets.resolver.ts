import { UseGuards } from "@nestjs/common"
import { Args, Query, Mutation, Resolver } from "@nestjs/graphql"
import { User } from "@prisma/client"
import { GqlAuthGuard } from "src/auth/auth.guard"
import { CurrentUser } from "src/auth/decorators/currentUser"
import { VoidScalar } from "src/scalars"
import { CreateTicketInput } from "./dto/create-ticket.input"
import { Ticket } from "./entities/ticket.entity"
import { TicketsService } from "./tickets.service"

@Resolver(() => Ticket)
export class TicketsResolver {
  constructor(private readonly ticketsService: TicketsService) {}

  @Mutation(() => String)
  @UseGuards(GqlAuthGuard)
  async createTicket(
    @CurrentUser() user: User,
    @Args("data") data: CreateTicketInput
  ) {
    return this.ticketsService.createTicket(
      user,
      data.type,
      data.public,
      data.openedBy,
      data.body
    )
  }

  @Mutation(() => VoidScalar, { nullable: true })
  @UseGuards(GqlAuthGuard)
  async deleteTicket(@CurrentUser() user: User, @Args("id") id: string) {
    await this.ticketsService.deleteTicket(user.id, id)
  }

  @Query(() => Ticket)
  @UseGuards(GqlAuthGuard)
  async getTicket(@CurrentUser() user: User, @Args("id") id: string) {
    return await this.ticketsService.getTicket(user.id, id)
  }

  @Query(() => [Ticket])
  @UseGuards(GqlAuthGuard)
  async getTickets(@CurrentUser() user: User) {
    return await this.ticketsService.getTickets(user.id)
  }
}
