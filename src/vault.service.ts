import { Injectable } from "@nestjs/common"
import vault from "node-vault"

@Injectable()
export class VaultService {
  public client: vault.client

  constructor() {
    this.client = vault({
      apiVersion: "v1",
      endpoint: "http://127.0.0.1:8200",
      token: "vault-plaintext-root-token"
    })
  }
}
