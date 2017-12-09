export interface Metadata<B> {
  args: any[],
  scope: B,
  key: string,
  method: Function,
  exception: undefined,
  result: undefined,
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
}

export interface ClassSignature<B> {
  (target: B)
}
