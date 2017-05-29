import { IStackEntry } from "./IStackEntry"

export interface IFakeMethodReplacement {
    (...args: any[]): any
    $$raw: (...args) => any
    $$before: IStackEntry[],
    $$after: IStackEntry[]
}
