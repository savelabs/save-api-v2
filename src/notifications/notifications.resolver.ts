import { Mutation, Resolver } from "@nestjs/graphql"
import { NotificationsService } from "./notifications.service"

@Resolver()
export class NotificationsResolver {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Mutation()
  async enableNotifications() {
    
  }
}
