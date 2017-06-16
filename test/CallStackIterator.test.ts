import { CallStackIterator } from '../src/core/CallStackIterator'
import { IStackEntry } from '../src/interface/IStackEntry'
import { IAdviceParamInjector } from '../src/interface/IAdviceParamInjector'
import { AdvicePool, IMetadata } from "../src/kaop-ts"

describe('CallStackIterator', () => {

  const spies = {
    isAsync: jest.fn(),
    isNotAsync: jest.fn()
  }

  class MyAdvice extends AdvicePool {
    static isNotAsync () {
      // this.next
      const a = 'this.next'
      spies.isNotAsync()
    }
  }

  const metadata: IMetadata = {
    scope: { name: 'pepe' },
    target: {},
    propertyKey: 'test',
    exception: null,
    rawMethod: jest.fn(),
    args: [],
    result: {}
  }

  interface AdviceMock extends IAdviceParamInjector {
    mockClear: Function
  }

  const advice = (jest.fn() as any) as AdviceMock

  let stackEntries: IStackEntry[] = [null]
  let iterator = new CallStackIterator(metadata, stackEntries)

  beforeEach(() => {
    (metadata.rawMethod as jest.Mock<{}>).mockClear()
    advice.mockClear()
    spies.isAsync.mockClear()
    spies.isNotAsync.mockClear()
  })

  it('Is instantiable', () => {
    expect(iterator).toBeDefined()
    expect(iterator).toBeInstanceOf(CallStackIterator)
  })

  it('Calls the original method if the current entry is null', () => {
    iterator = new CallStackIterator(metadata, stackEntries)
    expect(metadata.rawMethod).toHaveBeenCalledTimes(1)
  })

  it('Calls an advice if the current entry is not null', () => {
    const entries: IStackEntry[] = [{ advice, args: [] }]
    iterator = new CallStackIterator(metadata, entries)
    expect(metadata.rawMethod).not.toBeCalled()
    expect(advice).toBeCalled()
  })

  it('Calls an advice if the current entry is not null', () => {
    const fakeAdvice = MyAdvice.isNotAsync as IAdviceParamInjector
    const entries: IStackEntry[] = [
      null,
      { advice: fakeAdvice, args: [] },
      { advice, args: [] }
    ]
    iterator = new CallStackIterator(metadata, entries)
    expect(metadata.rawMethod).toBeCalled()
    expect(advice).toBeCalled()
    expect(spies.isNotAsync).toBeCalled()
  })
})
