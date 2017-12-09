import { getMetadata, defineMetadata } from "./reflect-metadata-polyfill"
import { KEY_ORIGINAL_METHOD, KEY_BEFORE_METHOD, KEY_AFTER_METHOD, KEY_BEFORE_INSTANCE, KEY_AFTER_INSTANCE } from "./constants"
import { AdviceRef, Metadata, MethodSignature, ClassSignature } from "./interfaces"
const { reflect } = require("kaop")

function generateKey (scope, methodName) {
  return `${scope}-${methodName}`
}

function wrapMethod (target, methodName, beforeKey, afterKey) {
  const keyOriginalMethod = generateKey(KEY_ORIGINAL_METHOD, methodName)
  return reflect.createProxyFn(target, methodName, [
    ...getMetadata(target, beforeKey) || [],
    getMetadata(target, keyOriginalMethod),
    ...getMetadata(target, afterKey) || []
  ])
}

function applyReflect (target, advices, methodName, keyJoinPoint, original) {
  const keyOriginalMethod = generateKey(KEY_ORIGINAL_METHOD, methodName)
  const adviceArr = getMetadata(target, keyJoinPoint) || []
  adviceArr.push(...advices.map(reflect.advice))
  defineMetadata(target, keyJoinPoint, adviceArr)
  if (!getMetadata(target, keyOriginalMethod)) defineMetadata(target, keyOriginalMethod, original)

  if (methodName === "constructor") {
    const keyBeforeInstance = generateKey(KEY_BEFORE_INSTANCE, methodName)
    const keyAfterInstance = generateKey(KEY_AFTER_INSTANCE, methodName)
    return wrapMethod(target, methodName, keyBeforeInstance, keyAfterInstance)
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
    target = applyReflect(
      target,
      advices,
      methodName,
      keyBeforeInstance,
      target
    )
    return target
  }
}

export function afterInstance<B = any> (...advices: AdviceRef<B>[]): ClassSignature<B> {
  return function (target, methodName = "constructor") {
    const keyAfterInstance = generateKey(KEY_AFTER_INSTANCE, methodName)
    target = applyReflect(
      target,
      advices,
      methodName,
      keyAfterInstance,
      target
    )
    return target
  }
}
