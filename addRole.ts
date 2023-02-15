import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

const args = process.argv.slice(2)

;(async () => {
  const userMatriculation = args.shift()

  await prisma.user.updateMany({
    where: { matriculation: userMatriculation },
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    data: {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      roles: {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        push: args
      }
    }
  })
})()
