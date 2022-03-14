import { UseGuards } from "@nestjs/common"
import { Args, Mutation, Resolver } from "@nestjs/graphql"
import { GqlAuthGuard } from "src/auth/auth.guard"
import { CurrentUser } from "src/auth/decorators/currentUser"
import { User } from "src/users/entities/user.entity"
import { CreateTicketInput } from "./dto/create-ticket.input"
import { TicketsService } from "./tickets.service"

@Resolver()
export class TicketsResolver {
  constructor(private readonly ticketsService: TicketsService) {}

  @Mutation(() => String)
  // @UseGuards(GqlAuthGuard)
  async createTicket(
    // @CurrentUser() user: User,
    @Args("data") data: CreateTicketInput
  ) {
    return this.ticketsService.createTicket(data.type, data.showName, data.body)
  }
}
