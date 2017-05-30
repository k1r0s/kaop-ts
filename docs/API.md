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

#### Get Started

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

- implement that advice (plug it anywhere):

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

#### Decorators

AOP it self has nothing to do with decorators, but its syntax is really cool to implement this technique.

This library includes 6 decorators and the building blocks to implement yours.

```Javascript

@afterMethod // join point
@beforeMethod // join point
@afterInstance // join point
@beforeInstance // join point
@adviceMetadata // used to retrieve target context
@adviceParam // used to retrieve advice params
```

They can be invoked as a function to retrieve an alias:

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
In order to retrieve target and stack metadata you must use `@adviceMetadata` decorator. [You may also use IMetadata interface](https://k1r0s.github.io/kaop-ts/interfaces/_src_interface_imetadata_.imetadata.html):

```Javascript
import { AdvicePool, adviceMetadata, IMetadata } from 'kaop-ts'

export class Registry extends AdvicePool {
  static log (@adviceMetadata meta: IMetadata) {
    meta.args // which contains the arguments to be received by decorated method
    meta.propertyKey // which is the name of the decorated method as string
    meta.scope // which is the instance or the context of the call stack
    meta.fakeReplacement // the original method (contains metadata)
    meta.target // the class definition
    meta.result // the value to be returned to outside (aka 'return')
    ...
  }
}

```

Advices also accept parameters

```Javascript

class Person {
  @afterMethod(Registry.log, 'log/file/path', 31, {what: 'ever'})
  getAge(){
    ...
  }
}

```
You can retrieve this params using adviceParam decorator:

```Javascript
import { AdvicePool, adviceMetadata } from 'kaop-ts'

export class Registry extends AdvicePool {
  static log (@adviceParam(0) path, @adviceParam(1) num) {
    path // "log/file/path"
    num // 31
    ...
  }
}

```

#### Available Join Points

This library allows (nowadays) to cut and inject code in four Join points:

```Javascript

@afterMethod // method decorator
@beforeMethod // method decorator
@afterInstance // class decorator
@beforeInstance // class decorator

```
Some contexts or metadata may be accesible in several cases. For example: trying to modify method arguments at `after` join point doesn't have any sense. *Maybe for comunication purposes between advices*.

You should not perform async calls during `beforeInstance` hooks becuase you will mess up instantation of that class.

#### Tips

> Decorators with advices can be stacked, even it is possible to perform async and dispatch next advice, like express middleware does.

> Advices share target context, arguments, result, or any property you bind to `this`. But keep in mind that it will only survive during call stack, then only thing preserved is the target instance.

> An advice is declared as `async` if contains `this.next` expression within. If this expression is declared but never called you messed up the stack.

> You can prevent main method execution by calling `this.stop`. This expression will avoid the decorated method to be executed. Useful when handling exceptions..
