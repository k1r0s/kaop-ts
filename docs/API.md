## **kaop-ts docs**

- :zap:           [Get started](#get-started)
- :eyeglasses:    [Examples](#examples)
- :books:         [Decorators](#decorators)
- :scissors:      [Available join points](#available-join-points)
- :mag_right:     [Inside an advice](#inside-an-advice)
- :cyclone:       [Async operations](#async-operations)
- :bulb:          [Tips](#tips)
- :sunglasses:    [Desmitifing AOP](#desmitifing-aop)

-----

#### Get started

- download and install the library:

  `npm i kaop-ts`

- create a simple advice:

  ```Javascript
  import { AdvicePool, adviceMetadata } from 'kaop-ts'

  export class MyAdvices extends AdvicePool {
    static doubleResult (@adviceMetadata metadata) {
      metadata.result += metadata.result
    }
  }

  ```

- implement that advice:

  ```Javascript
  import { afterMethod } from 'kaop-ts'
  import { MyAdvices } from './somewhere'

  class DummyExample {

    @afterMethod(MyAdvices.doubleResult)
    static calculateSomething (param1, param2) {
      return param1 * param2
    }
  }

  DummyExample.calculateSomething(3, 3) // 18
  DummyExample.calculateSomething(5, 5) // 50

  ```

- Now is up to you, check below for more in deep content :grinning:

#### Examples
todo

#### Decorators

AOP it self has nothing to do with decorators, but its syntax is a win to implement this technique.

This library includes 6 decorators and the building blocks to implement yours.

```Javascript

@afterMethod // join point
@beforeMethod // join point
@afterInstance // join point
@beforeInstance // join point
@adviceMetadata // used to retrieve target context
@adviceParam // used to retrieve advice params
```

They can be invoked as a function to create an alias:

```Javascript
// having this
@afterMethod(Registry.log)
// you can create an alias
const log = afterMethod(Registry.log)
// and then..

class Person {

  @log // log will be executed after method execution, as it was created
  getAge(){
    ...
  }
}

```

Advices also accept parameters
