import { AdvicePool, IMetadata, beforeMethod, adviceMetadata, adviceParam } from "../../src/kaop-ts"

class HttpService {
  static request (url: string, callback: Function): void {
    setTimeout(_ => {
      // stuff
      callback({result: "Even I preserve advice scope" })
    }, 1500)
  }
}

class MyServiceAdvice extends AdvicePool {
  static makeHttpRequest (@adviceParam(0) url, @adviceMetadata meta: IMetadata) {
    HttpService.request(url, message => {
      meta.args.push(message)
      this.next()
    })
  }
}

class YetAnotherDummyTest {
  private prop: string = "asd"

  @beforeMethod(MyServiceAdvice.makeHttpRequest, "/my/path")
  static loadSomething (callback: Function, asyncDataFromService?: any) {
    console.log(asyncDataFromService)
    callback()
  }
}

describe("kaop-ts demo -> scope reference showcase", () => {
  it("advices can hoist references as spected", (done) => {
    YetAnotherDummyTest.loadSomething(done)
  })
})
