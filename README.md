# kaop-ts (Alpha)

[kaop JS version](https://github.com/k1r0s/kaop)

[![Image travis](https://travis-ci.org/k1r0s/kaop-ts.svg?branch=master)](https://travis-ci.org/k1r0s/)
[![version](https://img.shields.io/npm/v/kaop-ts.svg)](https://www.npmjs.com/package/kaop-ts/)
[![Coverage Status](https://coveralls.io/repos/github/k1r0s/kaop-ts/badge.svg?branch=master)](https://coveralls.io/github/k1r0s/kaop-ts)
[![dependencies](https://david-dm.org/k1r0s/kaop-ts/status.svg)](https://david-dm.org/k1r0s/kaop-ts/status.svg)
[![dev-dependencies](https://david-dm.org/k1r0s/kaop-ts/dev-status.svg)](https://www.npmjs.com/package/kaop-ts)
[![downloads](https://img.shields.io/npm/dm/kaop-ts.svg)](https://www.npmjs.com/package/kaop-ts)

#### ES7 decorators to enhance your code :wink:

Bring the benefits of AOP to Javascript: https://en.wikipedia.org/wiki/Aspect-oriented_programming

[Brew explanation about AOP in Javascript/TS (out date API)](https://k1r0s.github.io/aop-intro/)

```javascript
import { afterMethod } from 'kaop-ts'

class Product {
  static price = 43.9

  @afterMethod(Registry.log)
  static applyTax(vatIncr){
    return this.price * vatIncr
  }
}

let nprice = Product.applyTax(0.18)
// do something in the background
```

#### set up an advice
think about functions that can be placed before, or after method calls or class instantation that access `decorated` scope's metadata
```javascript
import { AdvicePool } from 'kaop-ts'

class Registry extends AdvicePool {
  static log (@adviceMetadata metadata: IMetadata) {
    console.log(`${metadata.target.name}::${metadata.propertyKey}()`) // class and method name
    console.log(`called with arguments: `)
    console.log(metadata.args) // function arguments
    console.log(`output a result of: `)
    console.log(metadata.result) // returned value
  }
}
```

##### logs are the most boring example... :zzz:

```javascript
// write code for humans
class Component extends SomeOtherComponent {
  ...
  @beforeMethod(YourHttpService.getCached, '/url/to/html')
  @beforeMethod(YourHtmlParser.template)
  invalidate (parsedHtml?: any) {
    this.element.append(parsedHtml)
  }
}
...
componentInstance.invalidate()
// explanation below
```
What/How to previous example ? :scream:

- YourHttpService and YourHtmlParser have access to several services
- `static` method getCached (aka advice) is executed within 'Component' instance as its context, so both advices will access that scope during callstack, even in asynchronous way.
- `getCached` performs a request to "/url/to/html", on success it **places the result as the first parameter** in the call stack, then delegates to the next advice or method
- `template` only cares about take the **first parameter** which usually is (or has to be) an string that has to be parsed with a given context (like EJS). It replaces first parameter again and then delegates to the next advice or method
- there is not advices to be executed so main method `invalidate` is invoked, but now it has a parameter which has been processed but *code is beautiful and readable*

#### features

- Framework/library agnostic
- Endless possibilities
- Keep code organized
- Fun
- Lightweight/Tiny

[Read de API](/docs/API.md) or [Check annotated source](https://k1r0s.github.io/kaop-ts/)

Powered by TypeScript

#### Credits

https://github.com/alexjoverm/typescript-library-starter/ <3
