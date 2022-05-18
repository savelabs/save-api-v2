import { Controller, Get, Param, StreamableFile } from "@nestjs/common"
import { join } from "path"
import { createReadStream } from "fs"
import { FilesService } from "./files.service"

@Controller("files")
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Get("photos/:filename")
  getFile(@Param("filename") filename: string) {
    const file = createReadStream(join(process.cwd(), "uploads", filename))
    return new StreamableFile(file)
  }

  @Get("documents/:name")
  getDocument(@Param("name") name: string) {
    const file = createReadStream(join(process.cwd(), "uploads", name))
    return new StreamableFile(file)
  }
}
