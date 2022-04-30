import { Injectable } from "@nestjs/common"
import { User, Prisma } from "@prisma/client"
import { ReadStream } from "fs"
import { PrismaService } from "src/prisma.service"
import { createWriteStream } from "fs"
import cuid from "cuid"

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

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

  async updatePhoto(
    id: User["id"],
    createReadStream: () => ReadStream,
    extension: string
  ): Promise<boolean> {
    const photo_name = `${cuid()}.${extension}`
    await this.prisma.user.update({
      where: { id },
      data: { photoHref: `/uploads/${photo_name}` }
    })
    return new Promise(async (resolve, reject) =>
      createReadStream()
        .pipe(createWriteStream(`../../../uploads/${photo_name}`))
        .on("finish", () => resolve(true))
        .on("error", () => reject(false))
    )
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
}
