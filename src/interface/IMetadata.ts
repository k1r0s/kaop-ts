export interface IMetadata {
    scope: any,
    target: any,
    // target: Object | Function,
    propertyKey: string,
    rawMethod: () => any,
    args: any[],
    result: any
}
