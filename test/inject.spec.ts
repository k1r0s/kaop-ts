import { beforeMethod, afterMethod, beforeInstance } from "../src"
import { inject, override, provider } from "kaop"

class SomeService {
  store = {}

  get (key) {
    return this.store[key]
  }

  set (key, val) {
    return this.store[key] = val
  }
}

const SomeServiceProvider = provider.singleton(SomeService)
const AnotherServiceProvider = provider.factory(SomeService)

@beforeInstance(inject.args(SomeServiceProvider, AnotherServiceProvider))
class Test {
  $ser
  $anser
  constructor (serInstance?, anserInstance?) {
    this.$ser = serInstance
    this.$anser = anserInstance
  }
}

@beforeInstance(inject.assign({
  $ser: SomeServiceProvider,
  $anser: AnotherServiceProvider
}))
class DummyModel {
}

let test
let model

describe("inject specs", () => {
  beforeEach(() => {
    test = new Test()
    model = new DummyModel()
  })

  it("should be able to inject dependencies", () => {
    expect(model.$ser).toBeInstanceOf(SomeService)
    expect(test.$ser).toBeInstanceOf(SomeService)
  })

  it("injected singletons are restricted as a one instance", () => {
    model.$ser.set("test", "this is a test")
    test.$ser.set("test", "this is another test")

    expect(model.$ser.get("test")).toEqual("this is another test")
  })

  it("injected factories NOT are restricted to one instance", () => {
    model.$anser.set("test", "this is a test")
    test.$anser.set("test", "this is another test")

    expect(model.$anser.get("test")).toEqual("this is a test")
  })

})
