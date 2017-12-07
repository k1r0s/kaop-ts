import { beforeMethod } from ".."

const Delay = secs => meta => setTimeout(meta.commit, secs)

const soMuchDelay = [Delay(1000), Delay(1000), Delay(1000)]

const someBehavior = beforeMethod(...soMuchDelay, Delay(5))

class Car {
  @someBehavior
  startEngine (cbk) {
    cbk()
  }
}

let carInstance

describe("advance reflect.advice specs", () => {
  beforeAll(() => {
    carInstance = new Car()
  })

  it("Delay advice should stop the execution", done => {
    const time = Date.now()
    carInstance.startEngine(() => {
      expect(Date.now() - time).toBeGreaterThan(3000)
      expect(Date.now() - time).toBeLessThan(3100)
      done()
    })
  })
})
