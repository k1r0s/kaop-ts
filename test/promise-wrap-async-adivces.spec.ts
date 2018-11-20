import { beforeMethod, afterMethod } from "../src"

const delay = beforeMethod(meta => setTimeout(meta.commit, 10))
const handleError = afterMethod(meta => meta.handle())

class Dummy {

  @delay
  do1 () {
    return Promise.resolve(10)
  }

  do2 () {
    return Promise.resolve(10)
  }

  @delay
  do3 () {
    throw new Error("lmaooo")
  }

  @delay
  @handleError
  do4 () {
    throw new Error("lmaooo")
  }
}

let instance
describe("promise based advice", () => {
  beforeAll(() => {
    instance = new Dummy()
  })

  it("decorator should be able to return original value despite being wrapped by an asynchronous advice", () => {
    return instance.do1().then(num => expect(num).toBe(10))
  })

  it("method should be independent from advices", () => {
    return instance.do2().then(num => expect(num).toBe(10))
  })

  it("method should return a promise that rejects", () => {
    return instance.do3().catch(err => expect(err.message).toBe("lmaooo"))
  })

  it("should be able to work as spected when handling exceptions", () => {
    return instance.do4()
  })
})
