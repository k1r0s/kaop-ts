#### How do I define an Advice?

###### As an anonymous function ([warning about lambda!](https://github.com/k1r0s/kaop-ts/issues/18)):
```typescript
@beforeInstance(function() {
  // stuff
})
```
###### As an alias:
```typescript
const myCustomAdvice = beforeInstance(function() {
  // stuff
})

@myCustomAdvice
```
###### As an expression:
```typescript
const myCustomAdvice = function(...args) {
  return beforeInstance(function() {
    // stuff
  })
}

@myCustomAdvice(arg0, arg1)
```
###### Using TypeScript generics:
```typescript
const myCustomAdvice = beforeMethod<MyComponent, 'ngOnInit'>(function() {
  // stuff
})

@myCustomAdvice // can only be used at MyComponent::ngOnInit
```
###### (Old fashioned) As a static property of class that extends `AdvicePool`:
```typescript
class MyAdvices extends AdvicePool {
  static myCustomAdvice(meta) {
    // stuff
  }
}

@beforeMethod(MyAdvices.myCustomAdvice)
```

#### Metadata

```typescript
@beforeInstance(function(meta) {
  meta.args // Arguments to be received by decorated method
  meta.propertyKey // Name of the decorated method as string
  meta.scope // Instance or the context of the call stack
  meta.rawMethod // Original method
  meta.target // Class definition
  meta.result // The returned value by the method
})
```

#### Advice context `this`

```typescript
@beforeInstance(function() {
  this.next()
  // triggers the next advice or method in the
  // call stack (mandatory if your advice contains async operations)
  this.stop() // prevent execution of decorated method (GUESS WHY)
  this.break() // prevent execution of following advices until method execution
  this.stopped // boolean, will evaluate to true if stop() was called
})
```

#### Available Join Points

Join points allow you to plug Advices into parts of your code.

```typescript
@afterMethod // method accepts <B = any, K extends keyof B = any>
@beforeMethod // method accepts <B = any, K extends keyof B = any>
@onException // method accepts <B = any, K extends keyof B = any>

@afterInstance // class accepts <B = any>
@beforeInstance // class accepts <B = any>
```

Join points provide two generic placeholder to enhace strong typings. Check out [angular 2 example:](https://github.com/k1r0s/angular2-aop-showcase/blob/master/src/app/behaviors/resource-container.ts)

#### Comunication between Advices or decorated method (metadata)

- Advices plugged in the same callstack share **arguments** and **result**
- Advices plugged in static methods share its static context
- Advices plugged in non static methods share static and instance context

### Receiving params

An Advice have access to the original method/instance by [accessing its metadata](#metadata). But Advices can be parametrized too:

##### By closure reference
```typescript

const log = (path, num) => {
  return afterMethod(function(meta) {
    path // "log/file/path"
    num // 31
  })
}

class Person {
  // passed through join point
  @log('log/file/path', 31, {what: 'ever'})
  getAge() { ... }
}
```

##### Through join point
```typescript

import { AdvicePool, adviceMetadata } from 'kaop-ts'

// retrieved using `@adviceParam` decorator in the Advice
export class Registry extends AdvicePool {
  static log (@adviceParam(0) path, @adviceParam(1) num) {
    path // "log/file/path"
    num // 31
    ...
  }
}

class Person {
  // passed through join point
  @afterMethod(Registry.log, 'log/file/path', 31, {what: 'ever'})
  getAge() { ... }
}
```
## Call Stack

You can place many join points, they'll be executed sequentially, from top to bottom.

```typescript
class Component {
  ...
  @beforeMethod(YourHttpService.getCached, '/url/to/html')
  @beforeMethod(YourHtmlParser.template)
  invalidate (parsedHtml?: any) {
    this.element.append(parsedHtml)
  }
}
```

You have control over this call stack, for example you can also create [Async Advices](#async-advices).


_Note:_ you might find an `IMetadata was not found in 'kaop-ts'` issue. See [Troubleshooting](#troubleshooting) section for more info.

#### Async advices

By default, advices are synchronous, unless you use `this.next()` in your code. Then it is asynchronous and the flow will not continue until `this.next()` is called.

```typescript
import { AdvicePool } from 'kaop-ts'

export class PersistanceAdvices extends AdvicePool {
  static save () {
    ...
    this.next() // It must be called and reachable, otherwise the flow hangs
  }
}
```

The following example uses 2 Advices: the first one is asynchronous, while the second not. The second one needs to be called right after `read` has finished:

```typescript
// view.ts
import { beforeMethod } from 'kaop-ts'
import { PersistanceAdvices } from './persistance-advices'
import { FlowAdvices } from './flow-advices'
import { OrderModel } from './order-model'

class View {
  @beforeMethod(PersistanceAdvices.read, OrderModel)
  @beforeMethod(FlowAdvices.validate)
  update (data?) { ... }
}


// persistance-advices.ts
import { AdvicePool, adviceMetadata, adviceParam, IMetadata } from 'kaop-ts'
import { Service } from './somewhere'
import { ICommonModel } from './somewhere'

export class PersistanceAdvices extends AdvicePool {
  static read (@adviceMetadata meta: IMetadata, @adviceParam(0) model: ICommonModel) {
    Service.get(model.url)
    .then(data => meta.args.push(data))
    .then(this.next)
  }
}
```

Be careful, since decorated methods with **async Advices** return `undefined`
