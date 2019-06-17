import { KEY_ORIGINAL_METHOD, KEY_BEFORE_METHOD, KEY_AFTER_METHOD, KEY_BEFORE_INSTANCE, KEY_AFTER_INSTANCE } from "./constants"
import { AdviceRef, MethodSignature, ClassSignature } from "./interfaces"
import { reflect } from "kaop"
import { generateKey } from "./clear"
import "reflect-metadata"

function wrapMethod (target, methodName, original, befores, afters, caller?) {
  const adviceList = [
    ...(befores || []),
    original,
    ...(afters || [])
  ]
  return reflect.createProxyFn(target, methodName, adviceList, caller)
}

function replace (target, metaContainer, advices, methodName, keyJoinPoint, original) {
  const adviceArr = Reflect.getMetadata(keyJoinPoint, metaContainer) || []
  adviceArr.unshift(...advices.map(reflect.advice))
  Reflect.defineMetadata(keyJoinPoint, adviceArr, metaContainer)

  const keyOriginalMethod = generateKey(KEY_ORIGINAL_METHOD, methodName)
  if (!Reflect.getMetadata(keyOriginalMethod, metaContainer)) {
    Reflect.defineMetadata(keyOriginalMethod, original, metaContainer)
  }
  const originalMethod = Reflect.getMetadata(keyOriginalMethod, metaContainer)

  if (methodName === "constructor") {
    const keyBeforeMethod = generateKey(KEY_BEFORE_INSTANCE, methodName)
    const keyAfterMethod = generateKey(KEY_AFTER_INSTANCE, methodName)
    const beforeAdvices = Reflect.getMetadata(keyBeforeMethod, metaContainer)
    const afterAdvices = Reflect.getMetadata(keyAfterMethod, metaContainer)

    const nctor = wrapMethod(target, methodName, originalMethod, beforeAdvices, afterAdvices, meta =>
      Reflect.construct(meta.target.prototype.constructor, meta.args, meta.ES6newTarget))

    nctor.prototype = target.prototype
    return nctor
  } else {
    const keyBeforeMethod = generateKey(KEY_BEFORE_METHOD, methodName)
    const keyAfterMethod = generateKey(KEY_AFTER_METHOD, methodName)
    const beforeAdvices = Reflect.getMetadata(keyBeforeMethod, metaContainer)
    const afterAdvices = Reflect.getMetadata(keyAfterMethod, metaContainer)

    return wrapMethod(target, methodName, originalMethod, beforeAdvices, afterAdvices)
  }
}

export function beforeMethod<B = any, K extends keyof B = any> (...advices: AdviceRef<B>[]): MethodSignature<B, K> {
  return Object.assign((target, methodName, descriptor) => {
    const keyBeforeMethod = generateKey(KEY_BEFORE_METHOD, methodName)
    descriptor.value = replace(
      target,
      target,
      advices,
      methodName,
      keyBeforeMethod,
      descriptor.value
    )
    return descriptor
  }, { advices: () => advices })
}

export function afterMethod<B = any, K extends keyof B = any> (...advices: AdviceRef<B>[]): MethodSignature<B, K> {
  return Object.assign((target, methodName, descriptor) => {
    const keyAfterMethod = generateKey(KEY_AFTER_METHOD, methodName)
    descriptor.value = replace(
      target,
      target,
      advices,
      methodName,
      keyAfterMethod,
      descriptor.value
    )
    return descriptor
  }, { advices: () => advices })
}

export function beforeInstance<B = any> (...advices: AdviceRef<B>[]): ClassSignature<B> {
  return Object.assign((target, methodName = "constructor") => {
    const keyBeforeInstance = generateKey(KEY_BEFORE_INSTANCE, methodName)
    return replace(
      target,
      target.prototype,
      advices,
      methodName,
      keyBeforeInstance,
      target.prototype.constructor
    )
  }, { advices: () => advices })
}

export function afterInstance<B = any> (...advices: AdviceRef<B>[]): ClassSignature<B> {
  return Object.assign((target, methodName = "constructor") => {
    const keyAfterInstance = generateKey(KEY_AFTER_INSTANCE, methodName)
    return replace(
      target,
      target.prototype,
      advices,
      methodName,
      keyAfterInstance,
      target.prototype.constructor
    )
  }, { advices: () => advices })
}
