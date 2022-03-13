import { Injectable } from "@nestjs/common"
import { User, Prisma } from "@prisma/client"
import { PrismaService } from "src/prisma.service"

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(user: Prisma.UserCreateInput): Promise<User> {
    const createdUser = await this.prisma.user.create({ data: user })

    return createdUser
  }

  async getById(id: User["id"]): Promise<User> {
    return await this.prisma.user.findFirst({
      where: { id }
    })
  }

  async getByMatriculation(
    matriculation: User["matriculation"]
  ): Promise<User> {
    return await this.prisma.user.findFirst({
      where: { matriculation }
    })
  }
}
