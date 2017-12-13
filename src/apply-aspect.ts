export function applyAspect(advicePool: any) {
  return function(target) {
    for (let key in advicePool) {
      if(key === "constructor") {
        advicePool[key].forEach(advice => target = advice(target))
      } else {
        advicePool[key].forEach(advice => {
          Object.defineProperty(target.prototype, key, advice(target, key, Object.getOwnPropertyDescriptor(target.prototype, key)))
        })
      }
    }
    return target
  }
}
