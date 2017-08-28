import { CallStackIterator } from "../src/core/CallStackIterator"
import { IStackEntry } from "../src/interface/IStackEntry"
import { AdvicePool, IMetadata } from "../src/kaop-ts"

describe("CallStackIterator", () => {

  const spies = {
    isAsync: jest.fn(),
    isNotAsync: jest.fn()
  }

  class MyAdvice extends AdvicePool {
    static isNotAsync () {
      // this.next
      const a = "this.next"
      spies.isNotAsync()
    }
  }

  const metadata: IMetadata = {
    scope: { name: "pepe" },
    target: {},
    propertyKey: "test",
    exception: null,
    rawMethod: jest.fn(),
    args: [],
    result: {}
  }

  let advice = jest.fn()

  let stackEntries: IStackEntry[] = [null]
  let iterator = new CallStackIterator(metadata, stackEntries)

  beforeEach(() => {
    (metadata.rawMethod as jest.Mock<{}>).mockClear()
    advice.mockClear()
    spies.isAsync.mockClear()
    spies.isNotAsync.mockClear()
  })

  it("Is instantiable", () => {
    expect(iterator).toBeDefined()
    expect(iterator).toBeInstanceOf(CallStackIterator)
  })

  it("Calls the original method if the current entry is null", () => {
    iterator = new CallStackIterator(metadata, stackEntries)
    expect(metadata.rawMethod).toHaveBeenCalledTimes(1)
  })

  it("Calls an advice if the current entry is not null", () => {
    const entries: IStackEntry[] = [{ adviceFn: advice, args: [] }]
    iterator = new CallStackIterator(metadata, entries)
    expect(metadata.rawMethod).not.toBeCalled()
    expect(advice).toBeCalled()
  })
})
