import { InputType, Field, registerEnumType } from "@nestjs/graphql"

export enum TicketType {
  FEATURE = "Feature request",
  QUESTION = "Question",
  BUG = "Bug report"
}

registerEnumType(TicketType, {
  name: "TicketType"
})

@InputType()
export class CreateTicketInput {
  @Field()
  body: string

  @Field(() => TicketType)
  type: TicketType

  @Field()
  openedBy?: string

  @Field()
  public: boolean
}
