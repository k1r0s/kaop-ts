import { IStackEntry } from "./IStackEntry"

export interface IFakeMethodReplacement {
  (...args: any[]): any
  $$before: IStackEntry[],
  $$after: IStackEntry[],
  $$error: IStackEntry
}
