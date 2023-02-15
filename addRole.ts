import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

const args = process.argv.slice(2)

;(async () => {
  const userMatriculation = args.shift()

  await prisma.user.updateMany({
    where: { matriculation: userMatriculation },
    data: {
      roles: {
        push: args
      }
    }
  })
})()
