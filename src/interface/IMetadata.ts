export interface IMetadata<B = any> {
  scope: B,
  target: any,
    // target: Object | Function,
  propertyKey: string,
  exception: Error,
  rawMethod: (...args: any[]) => any,
  args: any[],
  result: any
}
