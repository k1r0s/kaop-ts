import { afterMethod } from "./decorators"
import { MethodSignature, AdviceRef } from "./interfaces"

export const onException = advice => afterMethod(meta => meta.exception && advice(meta))
