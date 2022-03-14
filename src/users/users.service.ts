import { Injectable } from "@nestjs/common"
import { User, Prisma } from "@prisma/client"
import { ReadStream } from "fs"
import { PrismaService } from "src/prisma.service"
import { createWriteStream } from "fs"
import cuid from "cuid"

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

  async getByMatriculation(
    matriculation: User["matriculation"]
  ): Promise<User> {
    return await this.prisma.user.findFirst({
      where: { matriculation }
    })
  }
}
