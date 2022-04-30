import { ObjectType, Field, ID } from "@nestjs/graphql"

@ObjectType()
export class User {
  @Field(() => ID)
  id: string

  @Field()
  matriculation: string

  @Field({ nullable: true })
  photoHref: string
}
