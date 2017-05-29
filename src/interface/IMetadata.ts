import { IFakeMethodReplacement } from "./IFakeMethodReplacement"

export interface IMetadata {
    scope: any,
    target: any,
    // target: Object | Function,
    propertyKey: string,
    fakeReplacement: IFakeMethodReplacement,
    args: any[],
    result: any
}
