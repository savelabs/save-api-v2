import { Injectable } from "@nestjs/common"
import { SuapService } from "src/suap/suap.service"

@Injectable()
export class FilesService {
  constructor(private readonly suapService: SuapService) {}

  async getDocument(matriculation: string, cookies: string, link: string) {
    return await this.suapService.request(
      { matricula: matriculation, site: cookies, api: "" },
      "baixarDocumentoStream",
      [link]
    )
  }
}
