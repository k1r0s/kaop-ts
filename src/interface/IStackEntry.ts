import { IAdviceParamInjector } from "./IAdviceParamInjector"

export interface IStackEntry {
  advice: IAdviceParamInjector
  args: any[]
}
