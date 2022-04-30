import { Injectable } from "@nestjs/common"
import { Queue } from "bull"
import { UsersService } from "src/users/users.service"
import { AuthService } from "src/auth/auth.service"
import { User } from "src/users/entities/user.entity"
import { InjectQueue } from "@nestjs/bull"

@Injectable()
export class NotificationsService {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    @InjectQueue("notifications") private queue: Queue
  ) {}

  async enableNotifications(user: User, password: string) {
    await this.usersService.enableNotifications(user.id)
  }
}
