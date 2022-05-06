import {
  VoidResolver,
  JWTResolver,
  UUIDResolver,
  JSONResolver,
  DateTimeResolver
} from "graphql-scalars"
import { createFromGraphQLScalar } from "nest-graphql-scalar-adapter"

export const VoidScalar = createFromGraphQLScalar({
  scalar: VoidResolver
})

export const JWTScalar = createFromGraphQLScalar({
  scalar: JWTResolver
})

export const UUIDScalar = createFromGraphQLScalar({
  scalar: UUIDResolver
})

export const JSONScalar = createFromGraphQLScalar({
  scalar: JSONResolver
})

export const DateTimeScalar = createFromGraphQLScalar({
  scalar: DateTimeResolver
})
