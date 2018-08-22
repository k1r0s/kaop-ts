export interface Metadata<B> {
  args: any[],
  scope: B,
  key: string,
  method: Function,
  exception: any,
  result: any,
  prevented: undefined,
  target: Object,
  handle: Function,
  commit: Function,
  prevent: Function,
  skip: Function
}

export interface AdviceRef<B> {
  (metadata: Metadata<B>)
}

export interface MethodSignature<B, K> {
  (target: B, key: K, descriptor)
  advices: () => AdviceRef<B>[]
}

export interface ClassSignature<B> {
  (target: B)
  advices: () => AdviceRef<B>[]
}

export interface AspectBuilder {
  (definition: AspectDefinition)
}

export interface AspectDefinition {
  decorateClass: Function,
  decorateMethod: Function,
}
