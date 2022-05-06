import { Injectable } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { User } from "@prisma/client"
import { randomUUID } from "crypto"
import { App, Octokit } from "octokit"
import { PrismaService } from "src/prisma.service"
import { TicketType } from "./dto/create-ticket.input"

@Injectable()
export class TicketsService {
  private octokit: Octokit

  constructor(
    private configService: ConfigService,
    private readonly prisma: PrismaService
  ) {
    const app = new App({
      appId: this.configService.get("github.app_id"),
      privateKey: this.configService.get("github.private_key"),
      oauth: {
        clientId: this.configService.get("github.client_id"),
        clientSecret: this.configService.get("github.client_secret")
      }
    })
    app
      .getInstallationOctokit(this.configService.get("github.installation_id"))
      .then((octokit) => {
        this.octokit = octokit
      })
  }

  async createTicket(
    user: User,
    type: TicketType,
    openIssue: boolean,
    name?: string,
    body?: string
  ) {
    const title = type.toString()

    let id: string

    if (name) {
      body += `\n\n**Aberto por ${name}**`
    }

    const labels = [type.toString()]

    if (openIssue) {
      const issue = await this.octokit.rest.issues.create({
        owner: "save-ifrn",
        repo: "save-tickets",
        title,
        body,
        labels
      })

      id = String(issue.data.id)
    } else {
      id = randomUUID()
    }

    return await this.prisma.ticket.create({
      data: {
        id,
        title,
        body,
        status: "ACTIVE",
        user: { connect: { id: user.id } },
        tags: labels
      }
    })
  }

  async deleteTicket(userId: string, id: string) {
    return await this.prisma.ticket.deleteMany({
      where: {
        id,
        userId
      }
    })
  }

  async getTickets(userId: string) {
    return await this.prisma.ticket.findMany({
      where: {
        userId
      }
    })
  }

  async getTicket(userId: string, id: string) {
    return await this.prisma.ticket.findFirst({
      where: {
        id,
        userId
      }
    })
  }
}
