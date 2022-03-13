import { JWTResolver, UUIDResolver, JSONResolver } from "graphql-scalars"
import { createFromGraphQLScalar } from "nest-graphql-scalar-adapter"

export const JWTScalar = createFromGraphQLScalar({
  scalar: JWTResolver
})

export const UUIDScalar = createFromGraphQLScalar({
  scalar: UUIDResolver
})

export const JSONScalar = createFromGraphQLScalar({
  scalar: JSONResolver
})
