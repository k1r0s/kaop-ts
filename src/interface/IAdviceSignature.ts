export interface IAdviceSignature<B, K> {
  (target: B, propertyKey: K, descriptor: PropertyDescriptor)
}
