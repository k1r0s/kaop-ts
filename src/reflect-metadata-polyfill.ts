import { META_KEY } from "./constants"

export const defineMetadata = function (target, key, prop) {
  if (!target[META_KEY]) target[META_KEY] = {}

  target[META_KEY][key] = prop
}

export const getMetadata = function (target, key) {
  return target[META_KEY] && target[META_KEY][key]
}
