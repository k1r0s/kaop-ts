import { adviceMetadata, adviceParam } from "../src/decorators"

describe(`
adviceMetadata decorator should be used to represent the position where metadata
must be injected as a param within an advice
  `, () => {

  it("should change $$meta property from a function object", () => {
    let fakeClass: any = { fakeMethod: function() {}}

    adviceMetadata(fakeClass, "fakeMethod", 0)

    expect(fakeClass.fakeMethod).toHaveProperty("$$meta")
    expect(fakeClass.fakeMethod.$$meta).toBe(0)
  })
})

describe(`
adviceParam should create an array with positions where advice arguments must
be placed
  `, () => {
    let fakeClass: any

  beforeEach(() => {
    fakeClass = { fakeMethod: function() {}}
  })

  it("should save index positions in array", () => {
    let fn1 = adviceParam(0)
    fn1(fakeClass, "fakeMethod", 1)
    let fn2 = adviceParam(1)
    fn2(fakeClass, "fakeMethod", 2)
    let fn3 = adviceParam(2)
    fn3(fakeClass, "fakeMethod", 3)



    expect(fakeClass.fakeMethod.$$params).toBeInstanceOf(Array)
    expect(fakeClass.fakeMethod.$$params.reduce((a, b) => a + b)).toBe(3)
    expect(fakeClass.fakeMethod.$$params).toMatchObject([, 0, 1, 2])
  })

  it("should save index positions in array", () => {
    let fn1 = adviceParam(2)
    fn1(fakeClass, "fakeMethod", 4)
    let fn2 = adviceParam(3)
    fn2(fakeClass, "fakeMethod", 1)
    let fn3 = adviceParam(4)
    fn3(fakeClass, "fakeMethod", 3)



    expect(fakeClass.fakeMethod.$$params).toBeInstanceOf(Array)
    expect(fakeClass.fakeMethod.$$params.reduce((a, b) => a + b)).toBe(9)
    expect(fakeClass.fakeMethod.$$params).toMatchObject([ , 3, , 4, 2])
  })
})
