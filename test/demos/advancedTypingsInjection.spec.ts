import { beforeInstance } from "../../src/kaop-ts"
// this code doesn't use providers, its only an example
// about how to implement raw DI

class Http {
  fetch(): Promise<any> {
    return new Promise((resolve, reject) => {
      setTimeout(resolve, 500)
    })
  }
}

const Inject = function(...types) {
  return beforeInstance(function(meta) {
    meta.args = types.map(type => new type)
  })
}

@Inject(Http)
class MyComponent {

  constructor(private http?: Http){}

  public somethingAync(callback: () => void) {
    this.http.fetch().then(callback)
  }
}

const comp = new MyComponent()

describe("It is worth to implement", () => {
  
  it("should wait 500 secs until fulfit", (done) => {
    comp.somethingAync(done)
  })
})

