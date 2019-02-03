### Logging

sample code:

```javascript
import { Log } from "./your-log-decorator";
import { beforeMethod } from "kaop-ts";

class ClassName {

  @beforeMethod(Log)
  someMethod() {
    ...
  }
}

```

### Catch decorator

[npm package and usage](https://www.npmjs.com/package/awesome-catch-decorator)

sample code:

```javascript
import Catch from "awesome-catch-decorator"

class AnyES6Class {
  @Catch(SyntaxError, () => ({}))
  static parseResponse(unvalidatedInputValue) {
    return JSON.parse(unvalidatedInputValue)
  }
}

// will always return an object
AnyES6Class.parseResponse()
AnyES6Class.parseResponse(",,,s,ds,sd,")
AnyES6Class.parseResponse('{ "message": "Okay, I get it" }')
```

### Http decorator

[npm package and usage](https://www.npmjs.com/package/http-decorator)

package it self is a bit outdated but u get the basic idea:

sample code:

```typescript

class SomeClass {
  @http({ url: 'localhost/resource'})
  public someMethod (params?: any, error?, result?): void {
    // error should be null if request was success
  }
}

someClassInstance.someMethod()
// $ curl localhost/resource
someClassInstance.someMethod({ id: 1 })
// $ curl localhost/resource?id=1

const prom:Promise<any> = someClassInstance.someMethod()

```

### Scoped-stylesheet decorator

[React/Preact npm package](https://www.npmjs.com/package/stylesheet-decorator)

Usage:

![Styling Preact Components](https://pbs.twimg.com/media/DMHogfLXcAAqova.jpg)

sample code:

```jsx
const style = `
  span { font-size: 20px; color: lightblue; }
`

class ClassName {
  @stylesheet(style)
  render() {
    return <span>something</span>
  }
}

```
