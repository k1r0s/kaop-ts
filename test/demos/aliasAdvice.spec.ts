import { AdvicePool, beforeMethod, adviceParam, adviceMetadata, IMetadata } from "../../src/kaop-ts"
import { MetadataKey } from '../../src/core/MetadataKeys'

class MyAdvicePool extends AdvicePool {
  static testAdvice (@adviceMetadata meta: IMetadata) {
    console.log("im a fucking alias")
    console.log(`first argument is: ${meta.args[0]}`)
  }
  static encapsulatedAdvice (@adviceParam(0) firstArg: string, @adviceParam(1) secondArg: any) {
    console.log("im a fucking alias and I have arguments too >.<!")
    console.log(`first advice argument is: ${firstArg}`)
    console.log(`second advice argument is: ${JSON.stringify(secondArg)}`)
  }
}

const testAdviceAlias = beforeMethod(MyAdvicePool.testAdvice)
const anotherTestAdviceAlias = (...args) => {
  args.unshift(MyAdvicePool.encapsulatedAdvice)
  return beforeMethod.apply(MyAdvicePool, args)
}

class MyBoringDummyTest {

  @testAdviceAlias
  @anotherTestAdviceAlias("custom", { someProp: 2 })
  something (url: string, callback: Function) {
    // stuff
    callback()
  }
}

describe("kaop-ts demo -> alias showcase", () => {
  it("new decorators can be encapsulated with an advice call", (done) => {
    let test = new MyBoringDummyTest()
    test.something("/path/to/anywhere", done)
  })
})
