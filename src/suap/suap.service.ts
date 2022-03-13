import { Injectable } from "@nestjs/common"
import { ClienteSuap, Credenciais } from "suap-sdk-javascript"

@Injectable()
export class SuapService {
  async request(credenciais: Credenciais, requestName: string, data: any) {
    const cliente = new ClienteSuap({ credenciais })
    return await cliente[requestName](data)
  }
}
