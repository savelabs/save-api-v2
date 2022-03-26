import { Field, ObjectType } from "@nestjs/graphql"
import { User } from "../../users/entities/user.entity"
import { JWTScalar, UUIDScalar } from "../../scalars"

@ObjectType()
export class AuthType {
  @Field(() => User)
  user: User

  @Field(() => JWTScalar)
  token: string

  @Field(() => UUIDScalar)
  refreshToken: string

  @Field()
  cookies: string
}
