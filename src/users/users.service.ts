import { Injectable } from "@nestjs/common"
import { User, Prisma } from "@prisma/client"
import { ReadStream } from "fs"
import { PrismaService } from "src/prisma.service"
import { createWriteStream } from "fs"
import cuid from "cuid"
import vault from "node-vault"

@Injectable()
export class UsersService {
  private vault: vault.client

  constructor(private readonly prisma: PrismaService) {
    this.vault = vault({
      apiVersion: "v2",
      token: "vault-plaintext-root-token"
    })
  }

  async create(
    user: Prisma.UserCreateInput & { password: string }
  ): Promise<User> {
    const createdUser = await this.prisma.user.create({
      data: { matriculation: user.matriculation }
    })

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
