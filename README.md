![kaop](http://i.imgur.com/6biEpsq.png)

[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Greenkeeper badge](https://badges.greenkeeper.io/k1r0s/kaop-ts.svg)](https://greenkeeper.io/)
[![Image travis](https://travis-ci.org/k1r0s/kaop-ts.svg?branch=master)](https://travis-ci.org/k1r0s/)
[![version](https://img.shields.io/npm/v/kaop-ts.svg)](https://www.npmjs.com/package/kaop-ts/)
[![Coverage Status](https://coveralls.io/repos/github/k1r0s/kaop-ts/badge.svg?branch=master)](https://coveralls.io/github/k1r0s/kaop-ts?branch=master)
[![dependencies](https://david-dm.org/k1r0s/kaop-ts/status.svg)](https://david-dm.org/k1r0s/kaop-ts/status.svg)
[![dev-dependencies](https://david-dm.org/k1r0s/kaop-ts/dev-status.svg)](https://www.npmjs.com/package/kaop-ts)
[![downloads](https://img.shields.io/npm/dm/kaop-ts.svg)](https://www.npmjs.com/package/kaop-ts)
[![Known Vulnerabilities](https://snyk.io/test/npm/kaop-ts/badge.svg)](https://snyk.io/test/npm/kaop-ts)

Lightweight, solid, framework agnostic and **easy to use** library written in TypeScript to deal with *Cross Cutting Concerns* and improve modularity in your code.

### Short Description (or what is an Advice)

This library provides a straightforward manner to implement **Advices** in your app. Advices are pieces of code that can be plugged in several places within OOP paradigm like 'beforeMethod', 'afterInstance'.. etc. Advices are used to change, extend, modify the behavior of methods and constructors non-invasively.

For in deep information about this technique check the [resources](#resources).

### Get started

```bash
npm install kaop-ts --save
```
Use a [join point](/docs/api.md#available-join-points) to plug it to any method/class:

```javascript
import { afterMethod } from 'kaop-ts'

class DummyExample {

  @afterMethod(meta => meta.result * 2)
  static calculateSomething (num, num2) {
    return num * num2
  }
}

DummyExample.calculateSomething(3, 3) // 18
DummyExample.calculateSomething(5, 5) // 50
```

### Whats new on 3.0

- Advices no longer use `this` to access several utilities.
- Metadata properties have been renamed. Here you can check [the reference ](https://github.com/k1r0s/kaop-ts/blob/master/docs/api.md#metadata).
- JoinPoints support multiple advices:

```javascript
// join point decorators expect a list of advices
@beforeMethod(advice1, advice2, advice3)
// even you can provide an advice array using spread operator
@beforeMethod(...adviceList)
someMethod() {

}

```

### Docs

- [Docs](/docs/api.md)
  - [Define an Advice](/docs/api.md#how-do-i-define-an-advice)
    - [As an anonymous function](/docs/api.md#as-an-anonymous-function-warning-about-lambda)
    - [As an alias](/docs/api.md#as-an-alias)
    - [Using TypeScript generics](/docs/api.md#using-typescript-generics)
  - [Metadata Object](/docs/api.md#metadata)
  - [Join Points](/docs/api.md#available-join-points)
  - [Comunication between Advices](/docs/api.md#comunication-between-advices-or-decorated-method-metadata)
  - [Parametrized Advices](/docs/api.md#receiving-params)
    - [By Closure ref](/docs/api.md#by-closure-reference)
  - [Call-stack](/docs/api.md#call-stack)
    - [Async Advices](/docs/api.md#async-advices)
- [Troubleshooting](/docs/faq.md)
  - [Babel param decorators](/docs/faq.md#babel-param-decorators)
  - [export 'IMetadata' was not found in 'kaop-ts'](/docs/faq.md#imetadata-was-not-found-in-kaop-ts)
  - [Decorated methods should be class members instead properties](/docs/faq.md#do-not-reassign-methods-or-use-decorators-on-arrow-functions-ie-public-something----)
  - [Warning about Async Advices](/docs/faq.md#avoid-async-advices-with-some-frameworks-functions-ie-react-render-function)
- [Community ideas/contributions](/docs/community.md)
  - @jcjolley [ES7 Async/Await Support](/docs/community.md#es7-asyncawait-support)
  - @alexjoverm [onException Join Point](https://github.com/k1r0s/kaop-ts/pull/4)
- [Some Examples](/docs/examples.md)
  (older version, API may defer)
  - [Working example about AOP/SRP with Angular 2+](https://github.com/k1r0s/angular2-srp-showcase)
  - [Log decorator implementation](/docs/examples.md#log-decorator)
  - [Http decorator using axios](/docs/examples.md#http-decorator)
  - [Preact scoped stylesheet decorator](/docs/examples.md#preact-scoped-stylesheet-decorator)


### Resources


- [Talk - AngularBeers (bcn) Separation of Concerns in modern JavaScript](https://github.com/k1r0s/angular-beers-dec19-separation-of-concerns)
- [Article about Angular2+, Decorators and SRP](https://hackernoon.com/angular-tutorial-separation-of-concerns-using-es7-decorators-ed6c9756265)
- [Aspect Oriented Programming in Javascript (ES5+\Typescript)](https://hackernoon.com/aspect-oriented-programming-in-javascript-es5-typescript-d751dda576d0)
- [How To Handle Exceptions With Aspect Programming And Blame Covfefe](https://hackernoon.com/today-im-gonna-show-you-a-brief-yet-useful-example-about-aspect-oriented-programming-b79b2cede864)
- [kaop ES5 version](https://github.com/k1r0s/kaop)
- [Slides about AOP](https://k1r0s.github.io/aop-intro/)

### Credits

Made using [TypeScript Library Starter](https://github.com/alexjoverm/typescript-library-starter/)

### Similar resources

- [mgechev/aspect.js](https://github.com/mgechev/aspect.js)
- [cujojs/meld](https://github.com/cujojs/meld)
