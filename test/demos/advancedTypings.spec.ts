import { beforeMethod } from "../../src/kaop-ts"

interface AsyncRequest {
    http: any // axios, http.. it requires some service
    url: string
    fetch(callback: () => void, data?): void
}

const AsyncRequestBehavior = beforeMethod<AsyncRequest, "fetch">(function(meta) {
  
  console.log(meta.scope)
  
  setTimeout((data) => {
    meta.args.push(data)
    this.next()
  }, 1000, { code: 200 })
})

class MyComponent implements AsyncRequest {
    url: string = "/path"
    http: any = null

    @AsyncRequestBehavior
    fetch(callback: () => void, data?) {
      console.log(data)
      callback()
    }
}

const comp: MyComponent = new MyComponent()

describe("ts compiler should complain if MyComponent doesn't implement `AsyncRequest`", () => {
  
  it("event advices can be defined as functions without class definition.. API update", (done) => {
    comp.fetch(done)
  })
})

