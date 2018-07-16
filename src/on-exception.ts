import { afterMethod } from "./decorators"

export const onException = advice => afterMethod(meta => meta.exception && advice(meta))
