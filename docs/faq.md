### Discourage about arrow functions in advice declaration

Briefly advices have its own context meaning that you should not define an Advice using an arrow function just because you need `this` to be pointing to the advice context. If you need to access to the decorated instance you should use `Metadata.scope` property.

Check this issue for more in deep information: https://github.com/k1r0s/kaop-ts/issues/18

### Babel param decorators

At first we did not support Babel because they drop support for decorators (year ago, by the time of writing)... nowadays they're going to fully implement this proposal, but still we're waiting...

Of course we're going to provide support for Babel users <span style="text-decoration: line-through">, but think that kaop-ts is intended to work with TypeScript</span>. If Babel team implements decorators proposal it will be good for us also. Please refer here: https://github.com/babel/proposals/issues/13

You should have at least this `.babelrc` setup:

```
{
    "presets": [
      "latest",
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

At any case you can still wrap your join point definition with another function to receive params which is a straight forward solution. Check receiving params [By Closure ref](/docs/api.md#by-closure-reference)

[Motivation](https://github.com/k1r0s/kaop-ts/issues/9)

### `IMetadata was not found in 'kaop-ts'`

This is due to an issue laying on TypeScript + Webpack + Angular.

Check out the [reasons and workaround](https://github.com/k1r0s/kaop-ts/issues/5#issuecomment-305759257)

###  Do not reassign methods or use decorators on arrow functions (i.e.: public something = () => {})

kaop-ts uses metadata properties inside methods or classes. If you alter that references by reasignment you'll mess Advice call stack.

###  Avoid async Advices with some frameworks functions (i.e.: React `render` function)

Careful when adding async Advices to some frameworks functions, let's say `render` method of React component. In this case, the method will be evaluated as `undefined` messing up React rendering.

### Useful Tips

> Join points decorators can be stacked and used sync or asynchronously.

> Advices share target context, arguments, result, or any property you bind to `this`. But keep in mind that it will only survive during the call stack, then the only thing preserved is the target instance.

> You can prevent main method execution by calling `this.stop`.

> Some contexts or metadata may be accessible in several cases. For example: trying to modify method arguments at `after` join point doesn't have any sense. *Maybe for communication purposes between advices*.

> You should not perform async calls during `beforeInstance` join points because you will mess up instantiation of that class.

> Async advices return 'undefined'
