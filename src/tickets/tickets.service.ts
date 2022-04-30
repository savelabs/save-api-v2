import { Injectable } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { App, Octokit } from "octokit"
import { TicketType } from "./dto/create-ticket.input"

@Injectable()
export class TicketsService {
  private octokit: Octokit

  constructor(private configService: ConfigService) {
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

  async createTicket(type: TicketType, showName: boolean, body: string) {
    const title = type.toString()

    const issue = await this.octokit.rest.issues.create({
      owner: "save-ifrn",
      repo: "save-tickets",
      title,
      body,
      labels: [type.toString()]
    })

    return issue.data.html_url
  }
}
