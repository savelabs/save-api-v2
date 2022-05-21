import { Module } from "@nestjs/common"
import { SuapModule } from "src/suap/suap.module"
import { FilesController } from "./files.controller"
import { FilesService } from "./files.service"

@Module({
  controllers: [FilesController],
  providers: [FilesService],
  imports: [SuapModule]
})
export class FilesModule {}
