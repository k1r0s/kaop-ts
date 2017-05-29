import { AdvicePool, IMetadata, beforeMethod, adviceMetadata, adviceParam } from "../../src/kaop-ts"

class MyAdvicePool extends AdvicePool {
  static testAdvice (@adviceParam(0) greet) {
    console.log(greet)
  }

  static asyncAdvice (@adviceMetadata metadata: IMetadata, @adviceParam(0) milisecs) {
    console.log(`MyAdvicePool.asyncAdvice execution`)
    console.log(`reading a property of the current instance: ${metadata.scope.someProp}`)
    setTimeout(_ => {
      console.log(`after waiting ${milisecs} ms`)
      metadata.args.push({ some: "async"} )
      this.next()
    }, milisecs)
  }
}

class MyDummyTest {

  public someProp: string = ":o!"

  @beforeMethod(MyAdvicePool.testAdvice, `hi, how are you!`)
  @beforeMethod(MyAdvicePool.asyncAdvice, 1000)
  something (url: string, callback: Function, asyncData?: any) {
    console.log(`method execution`)
    console.log(`url param ${url}`)
    console.log(`asyncData optional param ${asyncData.some}`)
    callback()
  }
}

describe("kaop-ts demo -> async decorators showcase", () => {
  it("advices are callback driven, advice stack will be executed when this.next is invoked", (done) => {
    let test = new MyDummyTest()
    test.something("/path/to/anywhere", done)
  })
})
