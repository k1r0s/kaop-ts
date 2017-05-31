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

These decorators may receive an `advice` as first param, you may place more arguments so they can be retrieved as arguments. Think about the same advice but you may need specific options in some cases.

#### Inside an advice

To create an advice you should simply create a class that inherits from `AdvicePool` an then create a static method in it. This is because advices need to have access to two protected methods: `next` and `stop` in order to obtain flow control during stack.

```Javascript
import { AdvicePool } from 'kaop-ts'

export class PersistanceAdvices extends AdvicePool {
  static save () {
    ...
    this.next()
  }
}

```
`this.next` needs to be called if declared in order to execute the next advice or method.

if `this.next` its not declared then advice will be considered as **synchronous** meaning that at the end of the function it will be called anyway.

The example below is completely valid, next advice or call will be executed as if `this.next` was declared at the bottom of function body. You can declare multiple advices in the same method without.

```Javascript
import { AdvicePool } from 'kaop-ts'

export class PersistanceAdvices extends AdvicePool {
  static save () {
    ...
    ...
  }
}
```
But if you need perform async tasks, for example dealing with persistence layer before executing some method... having the following code:

```Javascript
import { beforeMethod } from 'kaop-ts'
import { PersistanceAdvices } from './somewhere'
import { Flow } from './somewhere'
import { OrderModel } from './somewhere'

class View {

  @beforeMethod(PersistanceAdvices.read, OrderModel)
  @beforeMethod(Flow.validate)
  update (data?) {
    ...
    ...
  }
}

...

viewInstance.update() // trigger advice stack

```
So in this example `update` method has 2 advices, the first one is asynchronous. So the second one needs to be called right after `read` has finished. But `validate` shouldn't care about that. Because it could be inserted in many contexts and should behave always in the same way.

Let's take a look over `read` advice:

```Javascript
import { AdvicePoolm, adviceMetadata, adviceParam } from 'kaop-ts'
import { Service } from './somewhere'
import { ICommonModel } from './somewhere'

export class PersistanceAdvices extends AdvicePool {
  static read (@adviceMetadata meta, @adviceParam(0) model: ICommonModel) {
    Service.get(model.url)
    .then(data => meta.args.push(data))
    .then(this.next)
  }
}
```
So `read` advice assumes that first advice parameter is a model (that extends or may have a structure like `ICommonModel`) should have a property named url which contains the location in order to perform a request or what ever (let's say some call that cannot be tracked as synchronous code) so this is what we need `this.next`, because the next step in the call stack which in this case is `validate` advice need to be invoked when data is available. If we remove the last line of the body `validate` advice will be called immediately messing up everything.

You may effectively wonder that methods decorated with async advices wouldn't return anything but `undefined`.

Async calls can be executed after main method execution, for example placing an http request after user performs some action and has been handled:

```Javascript
import { beforeMethod } from 'kaop-ts'
import { Registry } from './somewhere'

class View {

  @afterMethod(Registry.saveInteraction)
  clickSomewhere () {
    ...
  }
}
```



#### Tips

> Decorators with advices can be stacked, even it is possible to perform async and dispatch next advice, like express middleware does.

> Advices share target context, arguments, result, or any property you bind to `this`. But keep in mind that it will only survive during call stack, then only thing preserved is the target instance.

> An advice is declared as `async` if contains `this.next` expression within. If this expression is declared but never called you messed up the stack.

> You can prevent main method execution by calling `this.stop`. This expression will avoid the decorated method to be executed. Useful when handling exceptions..

> Some contexts or metadata may be accesible in several cases. For example: trying to modify method arguments at `after` join point doesn't have any sense. *Maybe for comunication purposes between advices*.

> You should not perform async calls during `beforeInstance` hooks becuase you will mess up instantation of that class.

> Also if you're using some framework that require you to implement a function that return some value, let's say `render` method of React component. It is not a good idea place an async decorator before that method. Because `render` method will be evaluated as `undefined` messing up React rendering.
