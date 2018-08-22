import { beforeMethod } from "../src"

const MyDecorator = beforeMethod(meta => meta.args[0] += 10, meta => meta.args[0] += 3)

const MyNewDecorator = beforeMethod(...MyDecorator.advices(), meta => meta.args[0] *= 10)

class Dummy {
  @MyNewDecorator
  static operation (num) {
    return num
  }
}

describe("advices wrapped witha joinPoint can be retrieved", () => {
  it("should be able to access advice arg from a joinPoint signature", () => {
    expect(MyDecorator.advices()).toBeInstanceOf(Array)
    expect(MyNewDecorator.advices()).toBeInstanceOf(Array)
    expect(Dummy.operation(8)).toBe(210)
  })
})
