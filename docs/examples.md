### Log decorator

[npm package and usage](https://www.npmjs.com/package/decorator-log)

Code:

```javascript
import { afterMethod } from "kaop-ts";

export const Log = afterMethod(function(meta){
  const methodName = `${meta.target.constructor.name}::${meta.key}`;
  console.info(`log-decorator: ${methodName} invoked!`);
  console.info(`log-decorator: ${methodName} arguments -> `, meta.args);
  console.info(`log-decorator: ${methodName} result -> `, meta.result);
});
```

### Http decorator

[npm package and usage](https://www.npmjs.com/package/http-decorator)

Code:

```javascript
const axios = require('axios');
const { beforeMethod } = require('kaop-ts');

module.exports = {
  http: ({ method = 'get', ...options }) =>
  beforeMethod(function(meta){
    const [params] = meta.args;
    options[method === 'get' ? 'params' : 'data'] = params;
    axios({ method, ...options })
    .then(res => {
      meta.args = [params, null, res.data];
      this.next();
    })
    .catch(error => {
      meta.args = [params, error, null];
      this.next();
    })
  })
};
```

### Preact scoped-stylesheet decorator

[npm package](https://www.npmjs.com/package/stylesheet-decorator)

Usage:

![Styling Praect Components](https://pbs.twimg.com/media/DMHogfLXcAAqova.jpg)

Code:

```javascript
import { h } from "preact";
import { afterMethod } from "kaop-ts";
import decamelize from "decamelize";
import scope from "scope-css";

export const stylesheet = (styleContent) =>
afterMethod((meta) => {

  // create vnode stylesheet only once
  if(!meta.scope.__stylesheetVNode){
    meta.scope.__stylesheetTagName = decamelize(meta.target.constructor.name, "-");

    // remove all spaces, eols
    styleContent = styleContent.replace(/(\r\n\s|\n|\r|\s)/gm, "");

    // prefix all selectors to make stylesheet 'scoped' using scope-css package
    styleContent = scope(styleContent, meta.scope.__stylesheetTagName);

    // save a reference of the stylesheet within the class instance
    meta.scope.__stylesheetVNode = h("style", { scoped: true }, styleContent);
  }

  // wrap rendered vnode with another
  meta.result = h(
    meta.scope.__stylesheetTagName, null,
    [ meta.result, meta.scope.__stylesheetVNode ]
  );

});

```
