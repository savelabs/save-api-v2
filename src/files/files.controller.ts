import {
  Controller,
  Get,
  Param,
  Query,
  Req,
  StreamableFile,
  UseGuards,
  Headers
} from "@nestjs/common"
import { join } from "path"
import { createReadStream } from "fs"
import { JwtAuthGuard } from "src/auth/guards/auth.guard"
import type { FastifyRequest } from "fastify"
import { FilesService } from "./files.service"

@Controller("files")
export class FilesController {
  constructor(private filesService: FilesService) {}

  @UseGuards(JwtAuthGuard)
  @Get("photos/:filename")
  getFile(@Param("filename") filename: string) {
    const file = createReadStream(join(process.cwd(), "uploads", filename))
    return new StreamableFile(file)
  }

  @UseGuards(JwtAuthGuard)
  @Get("documents/")
  async getDocument(
    @Query("link") link: string,
    @Req() req: Request | FastifyRequest,
    @Headers("suap-cookies") cookies: string
  ) {
    return new StreamableFile(
      await this.filesService.getDocument(
        // @ts-ignore
        req.user.matriculation,
        cookies,
        link
      )
    )
  }
}
