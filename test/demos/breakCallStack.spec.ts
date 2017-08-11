import { beforeMethod, afterMethod } from "../../src/kaop-ts"

class YetAnotherDummyTest {

  static something: number = 1

  @beforeMethod(function (meta) { this.break() })
  @beforeMethod(function (meta) { meta.target.something++ })
  @beforeMethod(function (meta) { throw new Error(`Shouldn't be called here!!!`) })
  @beforeMethod(function (meta) { meta.target.something++ })
  @afterMethod(function (meta) { throw new Error(`I also shouldn't be called!!!11`) })
  @afterMethod(function (meta) { meta.target.something++ })
  static some () { console.log('hi') }
}

describe("kaop-ts demo -> break call stack if needed", () => {
  it("advices can determine if the following call stack must be break apart", () => {
    YetAnotherDummyTest.some()
    expect(YetAnotherDummyTest.something).toBeLessThan(2)
  })
})
