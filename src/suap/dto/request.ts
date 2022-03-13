import { InputType, Field } from "@nestjs/graphql"
import { JSONScalar } from "../../scalars"

@InputType()
export class SuapRequestInput {
  @Field()
  requestName: string

  @Field(() => JSONScalar)
  parameters: any
}
