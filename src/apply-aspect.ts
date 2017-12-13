export function applyAspect ({ instance = [], ...methodAdvices }: any) {
  return function (target) {
    for (let key in methodAdvices) {
      methodAdvices[key].forEach(advice =>
        Object.defineProperty(target.prototype, key,
          advice(target, key, Object.getOwnPropertyDescriptor(target.prototype, key))))
    }

    instance.forEach(advice => target = advice(target))
    return target
  }
}
