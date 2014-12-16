# defmulti

JavaScript polymorphism without requiring inheritance or Object orientism.

## Install

`defmulti` works on Node.js and in the browser.

    npm install defmulti

## Quick Start

## API Docs

## Choice of dispatch lookups

There are various tradeoffs in a JavaScript implementation of multimethods, this
module allows the user to make this choice themselves.

The default of `hashmap` should be the most generally applicable, but can be
exchanged for a choice that will yield greater performance or flexibility.

* `string`
  Results with identical string representations are considered equivalent.
* `json`
  Results with identical JSON representations are considered equivalent.
* `es6map`
  Expects an ES6 compatible `Map` implementation to exist. Uses the ES6 notion
  of `Map` equality for dispatch.
* `hashmap` *(default)*
  Results with the same value are considered equivalent. Uses the
  [hashmap](http://npm.im/hashmap) module.
* `predicate`
  Each registered method provides a predicate that can decide whether to handle
  the call. O(n) time, and method definition order can affect behaviour.
