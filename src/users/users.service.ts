import { Injectable } from "@nestjs/common"
import { User, Prisma } from "@prisma/client"
import { PrismaService } from "src/prisma.service"
import { writeFile } from "fs/promises"
import cuid from "cuid"

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getUsersCount(): Promise<number> {
    return await this.prisma.user.count()
  }

  async create(
    user: Prisma.UserCreateInput & { password: string }
  ): Promise<User> {
    const createdUser = await this.prisma.user.create({
      data: user
    })

    return createdUser
  }

  async updateApiToken(id: User["id"], token: User["suapApiToken"]) {
    await this.prisma.user.update({
      where: { id },
      data: { suapApiToken: token }
    })
  }

  async updatePassword(id: User["id"], password: User["password"]) {
    await this.prisma.user.update({
      where: { id },
      data: { password }
    })
  }

  async getCredentials(id: User["id"]): Promise<{
    password: User["password"]
    suapApiToken: User["suapApiToken"]
  }> {
    return await this.prisma.user.findUnique({
      where: { id },
      select: { password: true, suapApiToken: true }
    })
  }

  async getById(id: User["id"]): Promise<User> {
    return await this.prisma.user.findFirst({
      where: { id }
    })
  }

  async updatePhoto(id: User["id"], photo: string, extension: string) {
    const photoBuffer = Buffer.from(photo, "base64")

    const photoFilename = `${cuid()}.${extension}`

    await writeFile(`./uploads/${photoFilename}`, photoBuffer)

    const path = `/files/photos/${photoFilename}`

    await this.prisma.user.update({
      where: { id },
      data: { photoHref: path }
    })

    return path
  }

  async enableNotifications(id: User["id"]) {
    await this.prisma.user.update({
      where: { id },
      data: { showNotifications: true }
    })
  }

  async getByMatriculation(
    matriculation: User["matriculation"]
  ): Promise<User> {
    return await this.prisma.user.findFirst({
      where: { matriculation }
    })
  }

  async getActiveUsers(): Promise<User[]> {
    return await this.prisma.user.findMany({
      where: {
        lastLogin: {
          gte: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
        }
      }
    })
  }

  async getActiveUsersCount(): Promise<number> {
    return await this.prisma.user.count({
      where: {
        lastLogin: {
          gte: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
        }
      }
    })
  }
}
