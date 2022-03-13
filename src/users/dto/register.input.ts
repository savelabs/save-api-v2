import { InputType, Field } from "@nestjs/graphql"

@InputType()
export class RegisterInput {
  @Field()
  matriculation: string

  @Field()
  password: string
}
