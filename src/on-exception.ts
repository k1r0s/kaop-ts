import { afterMethod } from "./decorators"
import { MethodSignature, AdviceRef } from "./interfaces"

export const onException = <B = any, K extends keyof B = any>(advice: AdviceRef<B>): MethodSignature<B, K> => afterMethod(meta => meta.exception && advice(meta))
