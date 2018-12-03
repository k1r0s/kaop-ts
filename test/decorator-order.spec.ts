import { beforeMethod, afterMethod, afterInstance, beforeInstance } from "../src"

const op1 = meta => meta.args[0].push("op1")
const op2 = meta => meta.args[0].push("op2")
const op3 = meta => meta.args[0].push("op3")
const op4 = meta => meta.args[0].push("op4")
const op5 = meta => meta.args[0].push("op5")

@beforeInstance(op2)
@beforeInstance(op1)
@beforeInstance(op5)
class Dummy1 {
  constructor(a) {}
}

@beforeInstance(op2, op1, op5)
class Dummy2 {
  constructor(a) {}
}

class Dummy3 {
  @beforeMethod(op3, op5, op1)
  static someMethod (a) {}
}

class Dummy4 {
  @beforeMethod(op3)
  @beforeMethod(op5)
  @beforeMethod(op1)
  static someMethod (a) {}
}

@afterInstance(op4)
@afterInstance(op5)
@afterInstance(op1)
class Dummy5 {
  constructor(a) {}
}

@afterInstance(op4, op5, op1)
class Dummy6 {
  constructor(a) {}
}

class Dummy7 {
  @afterMethod(op2, op5, op3)
  static someMethod (a) {}
}

class Dummy8 {
  @afterMethod(op2)
  @afterMethod(op5)
  @afterMethod(op3)
  static someMethod (a) {}
}

describe("obtain several product by doing calculation to ensure advice order", () => {
  it("evaluate before instance order", () => {
    const r1 = []
    const r2 = []
    new Dummy1(r1)
    new Dummy2(r2)
    expect(r1.join()).toEqual(r2.join())
    expect(r1.join()).toEqual("op2,op1,op5")
  })
  it("evaluate after instance order", () => {
    const r1 = []
    const r2 = []
    new Dummy5(r1)
    new Dummy6(r2)
    expect(r1.join()).toEqual(r2.join())
    expect(r1.join()).toEqual("op4,op5,op1")
  })
  it("evaluate before method order", () => {
    const r1 = []
    const r2 = []
    Dummy3.someMethod(r1)
    Dummy4.someMethod(r2)
    expect(r1.join()).toEqual(r2.join())
    expect(r1.join()).toEqual("op3,op5,op1")
  })
  it("evaluate after method order", () => {
    const r1 = []
    const r2 = []
    Dummy7.someMethod(r1)
    Dummy8.someMethod(r2)
    expect(r1.join()).toEqual(r2.join())
    expect(r1.join()).toEqual("op2,op5,op3")
  })
})
