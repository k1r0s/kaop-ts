#### How do I define an Advice?

###### As an anonymous function:
```typescript
@beforeInstance(meta => {
  // stuff
})
```
###### As an alias:
```typescript
const myCustomAdvice = beforeInstance(meta => {
  // stuff
})

@myCustomAdvice
```
###### As an expression:
```typescript
const myCustomAdvice = (...args) => beforeInstance(meta => {
  // stuff
})

@myCustomAdvice(arg0, arg1)
```
###### Using TypeScript generics:
```typescript
const myCustomAdvice = beforeMethod<MyComponent, 'ngOnInit'>(function() {
  // stuff
})

@myCustomAdvice // can only be used at MyComponent::ngOnInit
```

#### Metadata

```typescript
@beforeInstance(function(meta) {
  meta.args // Arguments to be received by decorated method
  meta.key // Name of the decorated method as string
  meta.scope // Instance or the context of the call stack
  meta.method // Original method
  meta.target // Class definition
  meta.result // The returned value by the method
  meta.exception // current exception (if any). The exception should be handled
  // using `meta.handle()` to avoid error to be thrown.

  meta.commit() // triggers the next advice or method in the
  // call stack (mandatory if your advice contains async operations)

  meta.break() // prevent execution of following advices until method execution

  meta.handle() // returns the exception (if any) and prevents to be thrown.
})
```

#### Available Join Points

Join points allow you to plug Advices into parts of your code.

```typescript
@afterMethod // `method`. Accepts <B = any, K extends keyof B = any>
@beforeMethod // `method`. Accepts <B = any, K extends keyof B = any>
@onException // `method`. Built on top afterMethod. Accepts <B = any>

@afterInstance // `class`. Accepts <B = any>
@beforeInstance // `class`. Accepts <B = any>
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

const log = (path, num) => afterMethod(meta => {
  path // "log/file/path"
  num // 31
})

class Person {
  // passed through join point
  @log('log/file/path', 31)
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

By default, advices are synchronous, unless you use `meta.commit()` in your code. Then it is asynchronous and the flow will not continue until `meta.commit()` is called.

```typescript

const fetch = meta => {
  ...
  meta.commit() // It must be called and reachable, otherwise the flow hangs
}

const transform = meta => {
  ...
  const [ result, ...args ] = meta.args
  // applying some transformation to first argument received by the decorated method
  meta.args = [transformParams(result), ...args ]
}


```

The following example uses 2 Advices: the first one is asynchronous, while the second not. The second one needs to be called right after `fetch` has finished:

```typescript
// view.ts
import { beforeMethod } from 'kaop-ts'

class View {
  @beforeMethod(fetch, transform)
  setPermission () { ... }
}
```

Be careful, since decorated methods with **async Advices** return `undefined`
