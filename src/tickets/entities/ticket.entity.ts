import { ObjectType, Field, ID } from "@nestjs/graphql"
import { Status } from "@prisma/client"
import { DateTimeScalar } from "src/scalars"

@ObjectType()
export class Ticket {
  @Field(() => ID)
  id: string

  @Field()
  title: string

  @Field({ nullable: true })
  body: string

  @Field(() => [String])
  tags: string[]

  @Field()
  status: Status

  @Field(() => DateTimeScalar)
  createdAt: Date
}
