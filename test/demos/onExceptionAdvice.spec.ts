import { AdvicePool, IMetadata, beforeMethod, adviceMetadata } from "../../src/kaop-ts"

class MyAdvicePool extends AdvicePool {
  static onException (@adviceMetadata meta: IMetadata) {
    this.stop()
    try {
      meta.result = meta.rawMethod.apply(meta.scope, meta.args)
    } catch (err) {
      console.log(`There was an error in ${meta.propertyKey}(): -> ${err.message}`)
    }
  }
}

class ExceptionTest {

  @beforeMethod(MyAdvicePool.onException)
  // static wrongMethod (callback: number | Function) {
  static wrongMethod (callback: any) {
    callback()
  }
}

describe("kaop-ts demo -> exception join point", () => {
  it("advices are callback driven, advice stack will be executed when this.next is invoked", (done) => {
    ExceptionTest.wrongMethod(2)
    ExceptionTest.wrongMethod(done)
  })
})
