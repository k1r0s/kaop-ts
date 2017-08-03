import { AdvicePool, IMetadata, beforeInstance, afterInstance, adviceMetadata, adviceParam } from "../../src/kaop-ts"

class YetAnotherAdvicePool extends AdvicePool {

  static uselessAdvice (@adviceMetadata metadata: IMetadata) {
    metadata.args.push({test: 1})
    console.log(metadata.scope.prop)
  }
}

@beforeInstance(YetAnotherAdvicePool.uselessAdvice)
@afterInstance(YetAnotherAdvicePool.uselessAdvice)
class YetAnotherDummyTest {
  private prop: string = "asd"
  constructor () {
    console.log(arguments)
  }

  some() {}
}

describe("kaop-ts demo -> instance advices showcase", () => {
  it("advices can be executed within the class constructor as 'instance decorators'", (done) => {
    let test = new YetAnotherDummyTest()
    expect(test.some).toBeTruthy()
    done()
  })
})
