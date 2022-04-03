import { Injectable } from "@nestjs/common"
import vault from "node-vault"

@Injectable()
export class VaultService {
  public client: vault.client

  constructor() {
    this.client = vault({
      apiVersion: "v1",
      endpoint: "http://127.0.0.1:8200"
    })

    this.client
      .approleLogin({
        role_id: "8382ba85-0c0b-83fa-1e07-63aeed8d2bb7",
        secret_id: "7b28d037-60a7-f07c-e1ac-99e3efd79c9f"
      })
      .then((result: any) => {
        this.client.token = result.auth.client_token
      })
  }
}
