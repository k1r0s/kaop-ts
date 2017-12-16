import { beforeMethod, afterMethod, afterInstance, beforeInstance } from "../src"

const op1 = meta => meta.args[0]++
const op2 = meta => meta.args[0] * 2
const op3 = meta => meta.args[0] - 5
const op4 = meta => meta.args[0] * 10
const op5 = meta => meta.args[0] / 2

@beforeInstance(op2)
@beforeInstance(op1)
@beforeInstance(op5)
class Dummy1 {
  output
  constructor (arg) {
    this.output = arg
  }
}

@beforeInstance(op2, op1, op5)
class Dummy2 {
  output
  constructor (arg) {
    this.output = arg
  }
}

class Dummy3 {
  @beforeMethod(op3, op5, op1)
  static someMethod (arg) {
    return arg
  }
}

class Dummy4 {
  @beforeMethod(op3)
  @beforeMethod(op5)
  @beforeMethod(op1)
  static someMethod (arg) {
    return arg
  }
}

@afterInstance(op4)
@afterInstance(op5)
@afterInstance(op1)
class Dummy5 {
  output
  constructor (arg) {
    this.output = arg
  }
}

@afterInstance(op4, op5, op1)
class Dummy6 {
  output
  constructor (arg) {
    this.output = arg
  }
}

class Dummy7 {
  @afterMethod(op2, op5, op3)
  static someMethod (arg) {
    return arg
  }
}

class Dummy8 {
  @afterMethod(op2)
  @afterMethod(op5)
  @afterMethod(op3)
  static someMethod (arg) {
    return arg
  }
}

describe("obtain several product by doing calculation to ensure advice order", () => {
  it("evaluate before instance order", () => {
    const instance1 = new Dummy1(0)
    const instance2 = new Dummy2(0)
    expect(instance1.output).toEqual(instance2.output)
  })
  it("evaluate after instance order", () => {
    const instance5 = new Dummy5(0)
    const instance6 = new Dummy6(0)
    expect(instance5.output).toEqual(instance6.output)
  })
  it("evaluate before method order", () => {
    const res3 = Dummy3.someMethod(0)
    const res4 = Dummy4.someMethod(0)
    expect(res3).toEqual(res4)
  })
  it("evaluate after method order", () => {
    const res7 = Dummy7.someMethod(0)
    const res8 = Dummy8.someMethod(0)
    expect(res7).toEqual(res8)
  })
})
