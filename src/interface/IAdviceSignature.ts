export interface IAdviceSignature {
  (target: any, propertyKey: string, descriptor: PropertyDescriptor)
}
