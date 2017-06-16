import { AdvicePool, IMetadata, afterMethod, beforeMethod, adviceMetadata, adviceParam } from "../../src/kaop-ts"

class AnotherAdvicePool extends AdvicePool {

  static logMethod ( @adviceMetadata metadata: IMetadata) {
    if(this.stopped) { return }
    const logger = (param) => { console.log("LOGGER >> ", param) }
    logger(`${metadata.target.name}::${metadata.propertyKey}() called with arguments: `)
    logger(metadata.args)
    logger(`output a result of: `)
    logger(metadata.result)
  }

  static prevent () {
    this.stop()
  }
}

class AnotherDummyTest {

  @afterMethod(AnotherAdvicePool.logMethod)
  static someMethod (param0: string, param1: number): any {
    return param0 + param1
  }

  @beforeMethod(AnotherAdvicePool.prevent)
  @afterMethod(AnotherAdvicePool.logMethod)
  static anotherMethod (param0: number, param1: any): any {
    return param0 + param1
  }
}

describe("kaop-ts demo -> afterAdvice showcase", () => {
  it("logMethod should be executed after main method execution and should have access to its scope", (done) => {
    AnotherDummyTest.someMethod("myArgs", 3434)
    AnotherDummyTest.anotherMethod(13123232, 3434)
    done()
  })
})
