import { AdvicePool } from "../core/AdvicePool"

export interface IStackEntry {
  adviceFn: (this: AdvicePool, ...args) => void
  args: any[]
}
