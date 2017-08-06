![kaop](http://i.imgur.com/6biEpsq.png)

[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Image travis](https://travis-ci.org/k1r0s/kaop-ts.svg?branch=master)](https://travis-ci.org/k1r0s/)
[![version](https://img.shields.io/npm/v/kaop-ts.svg)](https://www.npmjs.com/package/kaop-ts/)
[![Coverage Status](https://coveralls.io/repos/github/k1r0s/kaop-ts/badge.svg?branch=master)](https://coveralls.io/github/k1r0s/kaop-ts)
[![dependencies](https://david-dm.org/k1r0s/kaop-ts/status.svg)](https://david-dm.org/k1r0s/kaop-ts/status.svg)
[![dev-dependencies](https://david-dm.org/k1r0s/kaop-ts/dev-status.svg)](https://www.npmjs.com/package/kaop-ts)
[![downloads](https://img.shields.io/npm/dm/kaop-ts.svg)](https://www.npmjs.com/package/kaop-ts)
[![Known Vulnerabilities](https://snyk.io/test/npm/kaop-ts/badge.svg)](https://snyk.io/test/npm/kaop-ts)

Lightweight, modular, framework agnostic and **easy to use** AOP library written in TypeScript that takes advantage of ES2016 Decorators.

### Get started

```bash
npm install kaop-ts
```
Use a [join point](#available-join-points) to plug it to any method/class:

```typescript
import { afterMethod } from 'kaop-ts'
import { MyAdvices } from './somewhere'

class DummyExample {

  @afterMethod((meta) => meta.result * 2)
  static calculateSomething (num, num2) {
    return num * num2
  }
}

DummyExample.calculateSomething(3, 3) // 18
DummyExample.calculateSomething(5, 5) // 50
```

### Usage

#### How do I define an Advice?

###### as an anonymous function:
```typescript
@beforeInstance(() => {
  // stuff
})
```
###### as an alias:
```typescript
const myCustomAdvice = beforeInstance(() => {
  // stuff
})

@myCustomAdvice
```
###### as an expression:
```typescript
const myCustomAdvice = (...args) => {
  beforeInstance(() => {
    // stuff
  })
}

@myCustomAdvice(arg0, arg1)
```
###### with generics:
```typescript
const myCustomAdvice = beforeMethod<Type1, 'method'>(() => {
  // stuff
})

@myCustomAdvice // can only used at Type1::method
```
###### (old) as a static property of class that extends `AdvicePool`:
```typescript
class MyAdvices extends AdvicePool {
  static myCustomAdvice(meta) {
    // stuff
  }
}

@beforeMethod(MyAdvices.myCustomAdvice)
```


### API

#### Metadata

```typescript
@beforeInstance((meta) => {
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
@beforeInstance(() => {
  this.next()
  // triggers the next advice or method in the
  // call stack (mandatory if your advice contains async operations)
  this.stop() // prevent execution of decorated method (GUESS WHY)
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

#### Comunication between Advices or decorated method (metadata)

- Advices plugged in the same callstack share **arguments** and **result**
- Advices plugged in static methods share its static context
- Advices plugged in non static methods share static and instance context

### receiving params

An Advice have access to the original method/instance by [accessing its metadata](#metadata). But Advices can be parametrized too:

##### By closure reference
```typescript

const log = (path, num) => {
  return afterMethod((meta) => {
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

The following example uses 2 Advices, the first one is asynchronous, while the second not. The second one needs to be called right after `read` has finished:

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

### Tips

> Join points decorators can be stacked and used sync or asynchronously.

> Advices share target context, arguments, result, or any property you bind to `this`. But keep in mind that it will only survive during the call stack, then the only thing preserved is the target instance.

> You can prevent main method execution by calling `this.stop`.

> Some contexts or metadata may be accessible in several cases. For example: trying to modify method arguments at `after` join point doesn't have any sense. *Maybe for communication purposes between advices*.

> You should not perform async calls during `beforeInstance` join points because you will mess up instantiation of that class.

> Async advices return 'undefined'

### Troubleshooting

##### Babel

At first we did not support Babel because they drop support for decorators (year ago).. nowadays they're going to fully implement this proposal, but still we're waiting..

Of course we're going to provide support for Babel users, but think that kaop-ts is intended to work with Typescript. If Babel team implements decorators proposal as it fit it will be good for us also. Please refer here: https://github.com/babel/proposals/issues/13

You should have this `.babelrc` setup:

```
{
    "presets": [
      "latest",
      "react",
      "stage-2"
    ],
    "plugins": ["transform-decorators-legacy"]
}
```

This library uses parameter Decorators proposal which is a WIP on babel. We made several modifications to make param decorators optional when typing advices.

So you have to avoid use of `adviceParam` and `adviceMetadada`. If you don't use param decorators advices will always have the following arguments:

```javascript
function myAdvice(metadata, param0, param1 [, paramx...]){}
```

[Motivation](https://github.com/k1r0s/kaop-ts/issues/9)

##### `IMetadata was not found in 'kaop-ts'`

This is due to an issue laying on TypeScript + Webpack + Angular.

Check out the [reasons and workaround](https://github.com/k1r0s/kaop-ts/issues/5#issuecomment-305759257)

#####  Do not reassign methods or use decorators on arrow functions (i.e.: public something = () => {})

kaop-ts uses metadata properties inside methods or classes. If you alter that references by reasignment you'll mess Advice call stack.

#####  Avoid async Advices with some frameworks functions (i.e.: React `render` function)

Careful when adding async Advices to some frameworks functions, let's say `render` method of React component. In this case, the method will be evaluated as `undefined` messing up React rendering.

### Resources

- [kaop ES5 version](https://github.com/k1r0s/kaop)
- [Slides about AOP](https://k1r0s.github.io/aop-intro/)

### Credits

Made using [TypeScript Library Starter](https://github.com/alexjoverm/typescript-library-starter/)
