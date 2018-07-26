import { afterMethod } from "./decorators"
import { MethodSignature, AdviceRef } from "./interfaces"

export function onException<B = any, K extends keyof B = any> (advice: AdviceRef<B>): MethodSignature<B, K> {
  return afterMethod(meta => meta.exception && advice(meta))
}
