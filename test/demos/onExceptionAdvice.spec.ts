import { AdvicePool, IMetadata, beforeMethod, adviceMetadata, adviceParam, onException } from "../../src/kaop-ts"

describe("kaop-ts demo -> onException join point", () => {

  let exceptionSpy = jest.fn()
  let noopSpy = jest.fn()
  let methodSpy = jest.fn()

  let orderArr = []

  class MyAdvicePool extends AdvicePool {
    static handleException (@adviceMetadata meta: IMetadata, @adviceParam(0) order) {
      orderArr.push(order)
      exceptionSpy()
    }

    static noop (@adviceParam(0) order) {
      orderArr.push(order)
      noopSpy()
    }
  }

  class ExceptionTest {

    @onException(MyAdvicePool.handleException)
    static wrongMethod (callback: any) {
      callback()
    }

    @beforeMethod(MyAdvicePool.noop, 0)
    @onException(MyAdvicePool.handleException, 1)
    @beforeMethod(MyAdvicePool.noop, 2)
    static orderTest (cb: any) {
      cb()
    }
  }

  beforeEach(() => {
    exceptionSpy.mockClear()
    methodSpy.mockClear()
    noopSpy.mockClear()
    orderArr = []
  })

  it("throws an exception and thus calls MyAdvicePool.handleException", () => {
    ExceptionTest.wrongMethod(2)
    ExceptionTest.wrongMethod(methodSpy)

    expect(exceptionSpy).toHaveBeenCalledTimes(1)
    expect(methodSpy).toHaveBeenCalledTimes(1)
  })

  it("onException must be called after the last beforeMethod, regardless of the order", () => {
    ExceptionTest.orderTest(4)
    expect(orderArr).toEqual([0, 2, 1])
  })

  it("prevents the original function from triggering twice", () => {
    ExceptionTest.orderTest(() => {
      methodSpy()
      throw Error()
    })

    expect(noopSpy).toHaveBeenCalledTimes(2)
    expect(exceptionSpy).toHaveBeenCalledTimes(1)
    expect(methodSpy).toHaveBeenCalledTimes(1)
  })
})
