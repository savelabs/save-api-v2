import { Field, InputType } from "@nestjs/graphql"

@InputType()
export class AuthInput {
  @Field()
  matriculation: string

  @Field()
  password: string
}
