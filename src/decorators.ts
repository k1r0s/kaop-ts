import { KEY_ORIGINAL_METHOD, KEY_BEFORE_METHOD, KEY_AFTER_METHOD, KEY_BEFORE_INSTANCE, KEY_AFTER_INSTANCE } from "./constants"
import { AdviceRef, Metadata, MethodSignature, ClassSignature } from "./interfaces"
import { reflect } from "kaop"
import "reflect-metadata"

function generateKey (scope, methodName) {
  return `${scope}-${methodName}`
}

function wrapMethod (target, methodName, beforeKey, afterKey, caller?) {
  const keyOriginalMethod = generateKey(KEY_ORIGINAL_METHOD, methodName)
  return reflect.createProxyFn(target, methodName, [
    ...Reflect.getMetadata(beforeKey, target) || [],
    Reflect.getMetadata(keyOriginalMethod, target),
    ...Reflect.getMetadata(afterKey, target) || []
  ], caller)
}

function applyReflect (target, advices, methodName, keyJoinPoint, original) {
  const keyOriginalMethod = generateKey(KEY_ORIGINAL_METHOD, methodName)
  const adviceArr = Reflect.getMetadata(keyJoinPoint, target) || []
  adviceArr.push(...advices.map(reflect.advice))
  Reflect.defineMetadata(keyJoinPoint, adviceArr, target)
  if (!Reflect.getMetadata(keyOriginalMethod, target)) Reflect.defineMetadata(keyOriginalMethod, original, target)

  if (methodName === "constructor") {
    const keyBeforeInstance = generateKey(KEY_BEFORE_INSTANCE, methodName)
    const keyAfterInstance = generateKey(KEY_AFTER_INSTANCE, methodName)
    const result = wrapMethod(target, methodName, keyBeforeInstance, keyAfterInstance, meta =>
      Reflect.construct(meta.target, meta.args, meta.ES6newTarget))
    result.prototype = target.prototype
    return result
  } else {
    const keyBeforeMethod = generateKey(KEY_BEFORE_METHOD, methodName)
    const keyAfterMethod = generateKey(KEY_AFTER_METHOD, methodName)
    return wrapMethod(target, methodName, keyBeforeMethod, keyAfterMethod)
  }
}

export function beforeMethod<B = any, K extends keyof B = any> (...advices: AdviceRef<B>[]): MethodSignature<B, K> {
  return function (target, methodName, descriptor) {
    const keyBeforeMethod = generateKey(KEY_BEFORE_METHOD, methodName)
    descriptor.value = applyReflect(
      target,
      advices,
      methodName,
      keyBeforeMethod,
      descriptor.value
    )
    return descriptor
  }
}

export function afterMethod<B = any, K extends keyof B = any> (...advices: AdviceRef<B>[]): MethodSignature<B, K> {
  return function (target, methodName, descriptor) {
    const keyAfterMethod = generateKey(KEY_AFTER_METHOD, methodName)
    descriptor.value = applyReflect(
      target,
      advices,
      methodName,
      keyAfterMethod,
      descriptor.value
    )
    return descriptor
  }
}

export function beforeInstance<B = any> (...advices: AdviceRef<B>[]): ClassSignature<B> {
  return function (target, methodName = "constructor") {
    const keyBeforeInstance = generateKey(KEY_BEFORE_INSTANCE, methodName)
    return applyReflect(
      target,
      advices,
      methodName,
      keyBeforeInstance,
      target
    )
  }
}

export function afterInstance<B = any> (...advices: AdviceRef<B>[]): ClassSignature<B> {
  return function (target, methodName = "constructor") {
    const keyAfterInstance = generateKey(KEY_AFTER_INSTANCE, methodName)
    return applyReflect(
      target,
      advices,
      methodName,
      keyAfterInstance,
      target
    )
  }
}
