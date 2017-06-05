export interface IMetadata {
  scope: any,
  target: any,
    // target: Object | Function,
  propertyKey: string,
  exception: Error,
  rawMethod: (...args: any[]) => any,
  args: any[],
  result: any
}
