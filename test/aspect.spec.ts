import { applyAspect, beforeMethod, afterMethod } from "../src"

const methodSpy = jest.fn()

const Delay = secs => meta => setTimeout(meta.commit, secs)

const Cache = (_ => {
  const CACHE_KEY = "#CACHE"
  return {
    read: meta => {
      if (!meta.scope[CACHE_KEY]) meta.scope[CACHE_KEY] = {}

      if (meta.scope[CACHE_KEY][meta.key]) {
        meta.result = meta.scope[CACHE_KEY][meta.key]
        meta.prevent()
      }
    },
    write: meta => {
      meta.scope[CACHE_KEY][meta.key] = meta.result
    }
  }
})()

@applyAspect({
  "_veryHeavyCalculation": [beforeMethod(Cache.read), afterMethod(Cache.write)],
  "doSomething": [beforeMethod(Delay(300))]
})
class Person {
  name
  age
  constructor (name, yearBorn) {
    this.name = name
    this.age = new Date(yearBorn, 1, 1)
  }

  _veryHeavyCalculation () {
    methodSpy()
    const today = new Date()
    return today.getFullYear() - this.age.getFullYear()
  }

  sayHello () {
    return `hello, I'm ${this.name}, and I'm ${this._veryHeavyCalculation()} years old`
  }

  doSomething (cbk) {
    cbk()
  }
}

let personInstance

describe("advance reflect.advice specs", () => {
  beforeAll(() => {
    personInstance = new Person("Manuelo", 1998)
  })

  it("cache advices should avoid '_veryHeavyCalculation' to be called more than once", () => {
    personInstance.sayHello()
    personInstance.sayHello()
    personInstance.sayHello()
    expect(methodSpy).toHaveBeenCalledTimes(1)

  })

  it("Delay advice should stop the execution for at least one segond", done => {
    const time = Date.now()
    personInstance.doSomething(() => {
      expect(Date.now() - time).toBeGreaterThan(280)
      done()
    })
  })
})
