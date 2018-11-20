### Babel

At first we did not support Babel because they drop support for decorators (year ago, by the time of writing)... nowadays they provide support under babel 6 [babel-plugin-transform-decorators-legacy](https://www.npmjs.com/package/babel-plugin-transform-decorators-legacy) or babel 7 [@babel/plugin-proposal-decorators](https://www.npmjs.com/package/@babel/plugin-proposal-decorators)

I would recommend babel 7 with following `.babelrc` setup:

```
{
  "presets": [["@babel/preset-env", {
    "targets": {
        <<<any es6 target>>>
      }
    }], "@babel/preset-stage-2"],
  "plugins": [
    ["@babel/plugin-proposal-decorators", { "legacy": true }]
  ]
}
```
[Motivation](https://github.com/k1r0s/kaop-ts/issues/9)

### Typescript

This is the minimal `tsconfig.json`.

```
{
    "compilerOptions": {
      "target": "es6",
      "experimentalDecorators": true
    }
}
```

###  Do not reassign methods or use decorators on arrow functions (i.e.: public something = () => {})

kaop-ts uses metadata properties inside methods or classes. If you alter that references by reasignment you'll mess Advice call stack.

### Useful Tips

> Join points decorators can be stacked and used sync or asynchronously.

> Advices share target context, arguments, result, or any property you bind to `this`. But keep in mind that it will only survive during the call stack, then the only thing preserved is the target instance.

> You can prevent main method execution by calling `meta.prevent`.

> Some contexts or metadata may be accessible in several cases. For example: trying to modify method arguments at `after` join point doesn't have any sense. *Maybe for communication purposes between advices*.
