import { KEY_ORIGINAL_METHOD } from "./constants"
import "reflect-metadata"

function getMethod (target, methodName): Function {
  const keyOriginalMethod = generateKey(KEY_ORIGINAL_METHOD, methodName)
  return Reflect.getMetadata(keyOriginalMethod, target)
}

function getConstructor (target): Function {
  const keyOriginalMethod = generateKey(KEY_ORIGINAL_METHOD, "constructor")
  return Reflect.getMetadata(keyOriginalMethod, target.prototype)
}

function reassignMethods (target): void {
  const members = Object.getOwnPropertyNames(target)
  members.forEach(member => {
    if (typeof target[member] === "function") {
      const originalMethod = getMethod(target, member)
      originalMethod && Object.defineProperty(target, member, { value: originalMethod })
    }
  })

}

export function clearAdvices (target): any {
  const originalConstructor = getConstructor(target)
  reassignMethods(originalConstructor)
  reassignMethods(originalConstructor.prototype)
  return originalConstructor
}

export function generateKey (scope, methodName): string {
  return `${scope}-${methodName}`
}

export const clearMethod = getMethod
