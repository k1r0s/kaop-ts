export function applyAspect ({ constructor = [], ...methodAdvices }: any) {
  return function (target) {
    for (let key in methodAdvices) {
      methodAdvices[key].forEach(advice =>
        Object.defineProperty(target.prototype, key,
          advice(target, key, Object.getOwnPropertyDescriptor(target.prototype, key))))
    }

    constructor.forEach(advice => target = advice(target))
    return target
  }
}
