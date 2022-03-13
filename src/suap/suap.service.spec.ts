import { Test, TestingModule } from "@nestjs/testing"
import { SuapService } from "./suap.service"

describe("SuapService", () => {
  let service: SuapService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SuapService]
    }).compile()

    service = module.get<SuapService>(SuapService)
  })

  it("should be defined", () => {
    expect(service).toBeDefined()
  })
})
