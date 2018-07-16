import { beforeInstance, afterInstance } from "../src"

@beforeInstance(_ => _)
@beforeInstance(_ => _, _ => _)
@afterInstance(_ => _, _ => _)
class Foo {}

class Bar extends Foo {
  sayHello () {
    return "hi"
  }
}

describe("Proto chain", () => {
  let bar

  beforeAll(() => {
    bar = new Bar()
  })

  it("Instance decorators do not broke protoChain on subclass hierarchy", () => {
    expect(bar).toBeInstanceOf(Foo)
    expect(bar).toBeInstanceOf(Bar)
    expect(bar.sayHello())
  })

})
