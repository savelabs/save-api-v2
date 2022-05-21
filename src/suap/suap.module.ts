import { Module } from "@nestjs/common"
import { SuapService } from "./suap.service"
import { SuapResolver } from "./suap.resolver"

@Module({
  providers: [SuapResolver, SuapService],
  exports: [SuapService]
})
export class SuapModule {}
