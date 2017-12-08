import { onException } from "../src/"

const catchVoid = onException(meta => meta.handle())

class Person {

  @catchVoid
  sayHello() {
    throw new Error("sayHello err");
  }
}

let personInstance;

describe("exception handling advice", () => {
  beforeEach(() => {
    personInstance = new Person;
  })

  it("Check error throw on invocation", () => {
    personInstance.sayHello();
  });

})
