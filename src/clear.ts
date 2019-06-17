import { KEY_ORIGINAL_METHOD, KEY_BEFORE_METHOD, KEY_AFTER_METHOD, KEY_BEFORE_INSTANCE, KEY_AFTER_INSTANCE } from "./constants"
import "reflect-metadata"

export function clearMethod (target, methodName): Function {
  const keyOriginalMethod = generateKey(KEY_ORIGINAL_METHOD, methodName)
  return Reflect.getMetadata(keyOriginalMethod, target.prototype)
}

export function clearConstructor (target): Function {
  const keyOriginalMethod = generateKey(KEY_ORIGINAL_METHOD, "constructor")
  return Reflect.getMetadata(keyOriginalMethod, target)
}

export function generateKey (scope, methodName): string {
  return `${scope}-${methodName}`
}
