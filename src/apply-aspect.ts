export function applyAspect (definition: any) {
  return function (target) {
    const ctor = definition["constructor"] instanceof Array ? definition["constructor"] : []
    delete definition["constructor"]

    for (let key in definition) {
      definition[key].forEach(advice =>
        Object.defineProperty(target.prototype, key,
          advice(target, key, Object.getOwnPropertyDescriptor(target.prototype, key))))
    }

    ctor.forEach(advice => target = advice(target))
    return target
  }
}
