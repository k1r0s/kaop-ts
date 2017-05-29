import { AdvicePool, IMetadata, beforeMethod, adviceMetadata, adviceParam } from "../../src/kaop-ts"

class MyServiceAdvice extends AdvicePool {
  static checkIfSomeCondition (@adviceMetadata meta: IMetadata) {
    console.log("advice execution")
    if(meta.args[1]){
      this.stop()
    }
  }
}

const checkIfSomeCondition = beforeMethod(MyServiceAdvice.checkIfSomeCondition)

class NotAnotherTestPlz {
  private prop: string = "asd"

  @checkIfSomeCondition
  static loadSomething (callback: Function, prevent?: boolean) {
    console.log("main method execution")
    callback()
  }
}

describe("kaop-ts demo -> deny method execution showcase", () => {
  it("'this.stop' avoids main method call", (done) => {
    NotAnotherTestPlz.loadSomething(done, true)
    NotAnotherTestPlz.loadSomething(done)
  })
})
