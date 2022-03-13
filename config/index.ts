import { readFileSync } from "fs"
import * as yaml from "js-yaml"
import { join } from "path"

const YAML_CONFIG_FILENAME = ".config.yml"
const YAML_SECRETS_FILENAME = ".secrets.yml"

const flattenObj = (ob: { [key: string]: any }): { [key: string]: any } => {
  const result = {}

  for (const i in ob) {
    if (typeof ob[i] === "object" && !Array.isArray(ob[i])) {
      const temp = flattenObj(ob[i])
      for (const j in temp) {
        result[i.toUpperCase() + "_" + j.toUpperCase()] = temp[j]
      }
    } else {
      result[i] = ob[i]
    }
  }
  return result
}

export default () => {
  const config = yaml.load(
    readFileSync(join(__dirname, YAML_CONFIG_FILENAME), "utf8")
  ) as Record<string, any>
  const secrets = yaml.load(
    readFileSync(join(__dirname, YAML_SECRETS_FILENAME), "utf8")
  ) as Record<string, any>

  const full_config = {
    ...config,
    ...secrets
  }

  for (const [key, value] of Object.entries(flattenObj(full_config))) {
    process.env[key] = value
  }

  return full_config
}
