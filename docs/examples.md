### Log decorator

[npm package and usage](https://www.npmjs.com/package/decorator-log)

Code:

```javascript
import { afterMethod } from "kaop-ts";

export const Log = afterMethod(function(meta){
  const methodName = `${meta.target.constructor.name}::${meta.propertyKey}`;
  console.info(`log-decorator: ${methodName} invoked!`);
  console.info(`log-decorator: ${methodName} arguments -> `, meta.args);
  console.info(`log-decorator: ${methodName} result -> `, meta.result);
});
```

### Http decorator

[npm package and usage](https://www.npmjs.com/package/dec-http)

Code:

```javascript
import axios from 'axios';
import { beforeMethod, IAdviceSignature } from 'kaop-ts';

export interface HttpGlobals {
  base: string
}

export const config: HttpGlobals = { base: '' };

export const http = (method = 'get', headers?) =>
beforeMethod(function(meta){
  const [ url, params ] = meta.args;
  const opts = { method, headers }
  opts[method === 'get' ? 'params' : 'data'] = params;
  opts['url'] = config.base ? `${config.base}/${url}`: url;
  axios(opts)
  .then(({ data }) => {
    meta.args = [ url, params, null, data ];
    this.next();
  })
  .catch((error) => {
    meta.args = [ url, params, error, null];
    this.next();
  })
});
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
