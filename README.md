# defmulti

Flexible JavaScript polymorphism without requiring inheritance or object
orientism.

## Install

`defmulti` works in Node.js and modern browsers.

It is not yet published to npm.

## Quick Start

Single argument dispatch based on properties:

```js
var defmulti = require('defmulti');

var area = defmulti(function(x) { return x.type });

function circle(r) {
    return { type: 'circle', radius: r };
}
area.method('circle', function(x) { return Math.PI * x.radius * x.radius });

function square(side) {
    return { type: 'square', side: side };
}
area.method('square', function(x) { return x.side * x.side });

area(circle(10));
// => 314.1592653589793

area(square(10));
// => 100
```

Multiple argument dispatch with a default

```js
var defmulti = require('defmulti');

var fight = defmulti(function(x, y) { return [x, y]; });

fight.method(['batman', 'robin'], function() { return 'batman wins'; });
fight.method(['batman', 'superman'], function() { return 'nobody knows'; });
fight.method(function(x, y) { return y; });

fight('batman', 'robin')
// => 'batman wins'

fight('batman', 'superman')
// => 'nobody knows'

fight('robin', 'penguin')
// => 'penguin'

fight('penguin', 'robin')
// => 'robin'
```

## API Docs

** TODO **

## Choice of dispatch lookups

** This section describes a feature not yet implemented **

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
  of `Map` equality for dispatch (roughly similar to `===` or `Object.is`).

* `hashmap` *(default)*
  Results with the same value are considered equivalent. Uses the
  [hashmap](http://npm.im/hashmap) module. Will not match different object
  instances with the same properties, try `json` or `deep-eql` in those cases.

* `deep-eql`
  Results that are deeply equal are considered equivalent. Uses the
  [deep-eql](http://npm.im/deep-eql) module. Access is O(n) time, consider
  whether you can use `json` instead.

* `predicate`
  Each registered method provides a predicate that can decide whether to handle
  the call. O(n) time, and method definition order can affect behaviour.

* `prototype`
  Supports inheritance-like prototype chains. eg. If the dispatch function
  returns `Array`, then the first of `Array`, `Function` or `Object` to be
  defined is used.
