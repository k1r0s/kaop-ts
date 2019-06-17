import { onException, beforeInstance, clearMethod } from "../src/"

const catchVoid = onException(meta => meta.handle())
const IsJose = beforeInstance(meta => meta.args = ["José"])

@IsJose
class Person {
  name;

  constructor(name) {
    this.name = name;
  }

  @catchVoid
  sayHello () {
    throw new Error("sayHello err")
  }
}

describe("clearing advices from classes", () => {
  let originalMethod;
  // let originalConstructor;

  beforeEach(() => {
    originalMethod = clearMethod(Person, "sayHello");
    // originalConstructor = clearConstructor(Person);
  })

  it("original method should throw an error", done => {
    try {
      originalMethod();
    } catch (e) {
      done();
    }
  })

  it.skip("should be able to invoque constructor as normal", done => {
    // const pinst = new originalConstructor("Samuel");
    //
    // console.log(pinst.name);

  })

})
