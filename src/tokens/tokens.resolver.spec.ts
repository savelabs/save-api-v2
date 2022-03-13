import { Test, TestingModule } from "@nestjs/testing"
import { TokensResolver } from "./tokens.resolver"
import { TokensService } from "./tokens.service"

describe("TokensResolver", () => {
  let resolver: TokensResolver

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TokensResolver, TokensService]
    }).compile()

    resolver = module.get<TokensResolver>(TokensResolver)
  })

  it("should be defined", () => {
    expect(resolver).toBeDefined()
  })
})
