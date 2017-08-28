import { AdvicePool } from "../src/core/AdvicePool"
import { bootstrap } from "../src/core/bootstrapFn"
import { CallStackIterator } from "../src/core/CallStackIterator"

import { IMetadata } from "../src/interface/IMetadata"
import { IStackEntry } from "../src/interface/IStackEntry"
import { adviceParam } from "../src/decorators"

const Person = function () {}
Person.prototype.setName = function() {}

describe("Advice pool does nothig, it only serves as representation of some CallStackIterator private methods", () => {
  it("AdvicePool should contain next and stop void methods", () => {
    expect(AdvicePool.next()).toBeUndefined()
    expect(AdvicePool.stop()).toBeUndefined()
    expect(AdvicePool.next).toBeDefined()
    expect(AdvicePool.stop).toBeDefined()
  })
})

describe("CallStackIterator contains many functions so call 'advices' which can access decorated context", () => {

  let fakeTarget: any, fakeMetadata: IMetadata

  beforeEach(() => {

    fakeMetadata = {
      scope: { name: "Jon" },
      target: function Person () {},
      propertyKey: "setName",
      rawMethod: function() {},
      args: ["Peter"],
      exception: null,
      result: undefined
    }

  })

  it("CallStackIterator instance should trigger inmediatly the callstack", () => {
    let methodSpy = jest.fn()
    fakeMetadata.rawMethod = function (name) { methodSpy(); return this.name = name }
    let fakeStack = [null]

    new CallStackIterator(fakeMetadata, fakeStack)

    expect(methodSpy).toHaveBeenCalledTimes(1)
    expect(fakeMetadata.result).toMatch(/Peter/)
    expect(fakeMetadata.scope.name).toMatch(/Peter/)
  })

  it("an advice should be injected before method execution which will remove first argument", () => {
    let methodSpy = jest.fn()
    fakeMetadata.rawMethod = function (name) { methodSpy(); return this.name = name }
    let fakeStack = [
      {
        adviceFn: function(meta){
          meta.args.pop()
        },
        args: []
      } as IStackEntry,
      null
    ]

    new CallStackIterator(fakeMetadata, fakeStack)

    expect(methodSpy).toHaveBeenCalledTimes(1)
    expect(fakeMetadata.result).toBeUndefined()
    expect(fakeMetadata.scope.name).toBeUndefined()
  })

  it("an advice containing callback should be called after the execution of main method", (done) => {
    let methodSpy = jest.fn()
    fakeMetadata.rawMethod = function (name) { methodSpy(); return this.name = name }
    let aParamInjector = function(){ setTimeout(done, 50) }
    let fakeStack = [null, {adviceFn: aParamInjector, args: []} as IStackEntry]

    new CallStackIterator(fakeMetadata, fakeStack)

    expect(methodSpy).toHaveBeenCalledTimes(1)
    expect(fakeMetadata.result).toMatch(/Peter/)
    expect(fakeMetadata.scope.name).toMatch(/Peter/)
  })

  it("perform an async stack with 2 delays sequentially", (done) => {
    let callback = () => {

      expect(methodSpy).toHaveBeenCalledTimes(1)
      expect(adviceSpy).toHaveBeenCalledTimes(2)
      expect(fakeMetadata.scope.name).toMatch(/PetersomeFakeString/)
      expect(fakeMetadata.result).toBeUndefined()
      done()
    }

    let methodSpy = jest.fn()
    let adviceSpy = jest.fn()
    fakeMetadata.rawMethod = function (name, another, cbk) { methodSpy(); this.name = name + another; cbk(); }
    let aParamInjector = function(meta){ adviceSpy(); setTimeout(_ => { meta.args.push("someFakeString"); this.next() }, 50) }
    let bParamInjector = function(meta){ adviceSpy(); setTimeout(_ => { meta.args.push(callback); this.next() }, 50) }
    let fakeStack = [
      {adviceFn: aParamInjector, args: []} as IStackEntry,
      {adviceFn: bParamInjector, args: []} as IStackEntry,
      null]

    new CallStackIterator(fakeMetadata, fakeStack)
  })

  it("advices accept parameters to change their behavior", () => {
    let methodSpy = jest.fn()
    fakeMetadata.rawMethod = function (name) { methodSpy(); return this.name = name }
    let obj = {
      adv: function(meta, param){
        expect(meta).toBeUndefined()
        expect(param).toBeDefined()
        expect(param).toBeGreaterThan(2)

        this.stop()
      }
    }

    const fn = adviceParam(0)

    fn(obj, "adv", 1)

    let fakeStack = [{adviceFn: obj.adv, args: [3]} as IStackEntry, null]

    new CallStackIterator(fakeMetadata, fakeStack)

    expect(fakeMetadata.result).toBeUndefined()
    expect(methodSpy).toHaveBeenCalledTimes(0)
  })

  it("CallStackIterator thirt param is used to set exception handler advice", () => {
    let exceptionSpy = jest.fn()
    fakeMetadata.rawMethod = function (name) { return this.name() }
    let adviceFn = function(meta){
      exceptionSpy()
      expect(meta.exception).toBeInstanceOf(Error)
    }
    new CallStackIterator(fakeMetadata, [null], { adviceFn, args: [] } as IStackEntry)

    expect(fakeMetadata.result).toBeUndefined()
    expect(exceptionSpy).toHaveBeenCalledTimes(1)
  })
})
