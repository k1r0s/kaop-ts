import { onException, afterMethod, beforeInstance, clearAdvices } from "../src/"
import "reflect-metadata"

const catchVoid = onException(meta => meta.handle())
const IsJose = beforeInstance(meta => meta.args = ["José"])
const return3 = afterMethod(meta => meta.result = 3)

@IsJose
class Person {
  name;

  constructor(name) {
    this.name = name;
  }

  @return3
  static getType() {
    return 2;
  }

  @catchVoid
  sayHello () {
    throw new Error("sayHello err")
  }
}

describe("clearing advices from classes", () => {
  const clearClass = clearAdvices(Person)

  it("original method should throw an error", () => {
    const p = new clearClass
    expect(p.sayHello).toThrow(Error)
  })

  it("should be able to invoque constructor as normal", () => {
    const p = new clearClass("Samuel")
    expect(p.name).toBe("Samuel")
  })

  it("should be able to clear static methods", () => {
    expect(clearClass.getType()).toBe(2)
  })

})
