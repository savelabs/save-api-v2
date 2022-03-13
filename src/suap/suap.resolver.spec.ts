import { Test, TestingModule } from "@nestjs/testing"
import { SuapResolver } from "./suap.resolver"
import { SuapService } from "./suap.service"

describe("SuapResolver", () => {
  let resolver: SuapResolver

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SuapResolver, SuapService]
    }).compile()

    resolver = module.get<SuapResolver>(SuapResolver)
  })

  it("should be defined", () => {
    expect(resolver).toBeDefined()
  })
})
