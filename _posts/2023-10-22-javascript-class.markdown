---
layout: post
title:  "How to rewrite classes using closures in JavaScript"
date:   2023-10-22 00:00:00 +0530
categories: tech
permalink: /blog/javascript-class-closure
---

## Update

I'm very humbled by the insightful discussion on [HackerNews](https://news.ycombinator.com/item?id=37966510). Really, thank you! I have now updated the blog post to address the comments. You can always view the diff [on GitHub](https://github.com/GaurangTandon/gaurangtandon.github.io/commits/master/_posts/2023-10-22-javascript-class.markdown).

## Introduction

As much as I dislike the `class` syntax in JavaScript, it used to be my default choice when I needed an object factory, with support for static and instance level properties.

I recently found a clean way to eliminate the `class` syntax while still maintaining these properties, and in this post, I'll show you how.

## _Classy_ issues

Classes are plagued with issues, such as:

### `this` is awkward

Having to write:

```js
this.progressBar.addEventListener(this.handler.bind(this));
```

is much worse compared to:

```js
progressBar.addEventListener(handler);
```

The `this` prefix is mandatory for every instance property, which increases code bloat. When passing methods around, you have to carefully rebind them to the correct object.

### Regarding private properties

I initially wrote that classes don't support private properties. That was completely wrong, as [this MDN article mentions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Private_class_fields).
Using private properties helps better encapsulate internal logic, that we don't want external code to depend on. I'm glad JS classes support that.

### Regarding readonly properties

I initially wrote that we cannot have instance properties that are public but readonly. For example, this is valid JavaScript:

```js
class MyClass {
  static prop = 123;
}
MyClass.prop = 456;
```

As comments pointed out, you can define a `get`ter instead:

```js
class MyClass {
  static get prop() {
    return 123;
  }
}
MyClass.prop = 456; // doesn't change the value
```

### Poor bundler optimization

If you are building a large class encapsulating some complex logic, you likely have dozens of private methods as "helper" methods, but only a few externally exposed methods. Unfortunately, build tools like `terser` or `webpack` cannot optimize them well. For example:

```js
class MyClass {
  constructor() {
    this.prop = 5;
  }
  publicMethod() {
    this.property = 6;
  }
}
const unused = 5;
const instance = new MyClass();
console.log(instance.prop);
```

When optimized with `npx webpack --mode production`, this results in:

```js
(()=>{const o=new class{constructor(){this.prop=5}publicMethod(){this.property=6}};console.log(o.prop)})();
```

Notice how: 1. the unused instance method is not removed, and 2. the name of this instance method is not simplified.

### Poor linting experience

Unused methods and properties are never flagged by `eslint` (here's an [example](https://eslint.org/play/#eyJ0ZXh0IjoiY29uc3QgdW51c2VkVmFyID0gMTIzO1xuXG5jbGFzcyBNeUNsYXNzIHtcbiAgc3RhdGljIHVudXNlZFN0YXRpY1Byb3BlcnR5ID0gNjtcbiAgXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMudW51c2VkUHJvcGVydHkgPSA1O1xuICB9XG4gIFxuICB1bnVzZWRNZXRob2QoKSB7XG4gICAgXG4gIH1cbn1cblxubmV3IE15Q2xhc3MoKTtcbiIsIm9wdGlvbnMiOnsiZW52Ijp7ImVzNiI6dHJ1ZX0sInBhcnNlck9wdGlvbnMiOnsiZWNtYUZlYXR1cmVzIjp7fSwiZWNtYVZlcnNpb24iOiJsYXRlc3QiLCJzb3VyY2VUeXBlIjoic2NyaXB0In0sInJ1bGVzIjp7ImNvbnN0cnVjdG9yLXN1cGVyIjpbImVycm9yIl0sImZvci1kaXJlY3Rpb24iOlsiZXJyb3IiXSwiZ2V0dGVyLXJldHVybiI6WyJlcnJvciJdLCJuby1hc3luYy1wcm9taXNlLWV4ZWN1dG9yIjpbImVycm9yIl0sIm5vLWNhc2UtZGVjbGFyYXRpb25zIjpbImVycm9yIl0sIm5vLWNsYXNzLWFzc2lnbiI6WyJlcnJvciJdLCJuby1jb21wYXJlLW5lZy16ZXJvIjpbImVycm9yIl0sIm5vLWNvbmQtYXNzaWduIjpbImVycm9yIl0sIm5vLWNvbnN0LWFzc2lnbiI6WyJlcnJvciJdLCJuby1jb25zdGFudC1jb25kaXRpb24iOlsiZXJyb3IiXSwibm8tY29udHJvbC1yZWdleCI6WyJlcnJvciJdLCJuby1kZWJ1Z2dlciI6WyJlcnJvciJdLCJuby1kZWxldGUtdmFyIjpbImVycm9yIl0sIm5vLWR1cGUtYXJncyI6WyJlcnJvciJdLCJuby1kdXBlLWNsYXNzLW1lbWJlcnMiOlsiZXJyb3IiXSwibm8tZHVwZS1lbHNlLWlmIjpbImVycm9yIl0sIm5vLWR1cGUta2V5cyI6WyJlcnJvciJdLCJuby1kdXBsaWNhdGUtY2FzZSI6WyJlcnJvciJdLCJuby1lbXB0eSI6WyJlcnJvciJdLCJuby1lbXB0eS1jaGFyYWN0ZXItY2xhc3MiOlsiZXJyb3IiXSwibm8tZW1wdHktcGF0dGVybiI6WyJlcnJvciJdLCJuby1leC1hc3NpZ24iOlsiZXJyb3IiXSwibm8tZXh0cmEtYm9vbGVhbi1jYXN0IjpbImVycm9yIl0sIm5vLWV4dHJhLXNlbWkiOlsiZXJyb3IiXSwibm8tZmFsbHRocm91Z2giOlsiZXJyb3IiXSwibm8tZnVuYy1hc3NpZ24iOlsiZXJyb3IiXSwibm8tZ2xvYmFsLWFzc2lnbiI6WyJlcnJvciJdLCJuby1pbXBvcnQtYXNzaWduIjpbImVycm9yIl0sIm5vLWlubmVyLWRlY2xhcmF0aW9ucyI6WyJlcnJvciJdLCJuby1pbnZhbGlkLXJlZ2V4cCI6WyJlcnJvciJdLCJuby1pcnJlZ3VsYXItd2hpdGVzcGFjZSI6WyJlcnJvciJdLCJuby1sb3NzLW9mLXByZWNpc2lvbiI6WyJlcnJvciJdLCJuby1taXNsZWFkaW5nLWNoYXJhY3Rlci1jbGFzcyI6WyJlcnJvciJdLCJuby1taXhlZC1zcGFjZXMtYW5kLXRhYnMiOlsiZXJyb3IiXSwibm8tbmV3LXN5bWJvbCI6WyJlcnJvciJdLCJuby1ub25vY3RhbC1kZWNpbWFsLWVzY2FwZSI6WyJlcnJvciJdLCJuby1vYmotY2FsbHMiOlsiZXJyb3IiXSwibm8tb2N0YWwiOlsiZXJyb3IiXSwibm8tcHJvdG90eXBlLWJ1aWx0aW5zIjpbImVycm9yIl0sIm5vLXJlZGVjbGFyZSI6WyJlcnJvciJdLCJuby1yZWdleC1zcGFjZXMiOlsiZXJyb3IiXSwibm8tc2VsZi1hc3NpZ24iOlsiZXJyb3IiXSwibm8tc2V0dGVyLXJldHVybiI6WyJlcnJvciJdLCJuby1zaGFkb3ctcmVzdHJpY3RlZC1uYW1lcyI6WyJlcnJvciJdLCJuby1zcGFyc2UtYXJyYXlzIjpbImVycm9yIl0sIm5vLXRoaXMtYmVmb3JlLXN1cGVyIjpbImVycm9yIl0sIm5vLXVuZGVmIjpbImVycm9yIl0sIm5vLXVuZXhwZWN0ZWQtbXVsdGlsaW5lIjpbImVycm9yIl0sIm5vLXVucmVhY2hhYmxlIjpbImVycm9yIl0sIm5vLXVuc2FmZS1maW5hbGx5IjpbImVycm9yIl0sIm5vLXVuc2FmZS1uZWdhdGlvbiI6WyJlcnJvciJdLCJuby11bnNhZmUtb3B0aW9uYWwtY2hhaW5pbmciOlsiZXJyb3IiXSwibm8tdW51c2VkLWxhYmVscyI6WyJlcnJvciJdLCJuby11bnVzZWQtdmFycyI6WyJlcnJvciJdLCJuby11c2VsZXNzLWJhY2tyZWZlcmVuY2UiOlsiZXJyb3IiXSwibm8tdXNlbGVzcy1jYXRjaCI6WyJlcnJvciJdLCJuby11c2VsZXNzLWVzY2FwZSI6WyJlcnJvciJdLCJuby13aXRoIjpbImVycm9yIl0sInJlcXVpcmUteWllbGQiOlsiZXJyb3IiXSwidXNlLWlzbmFuIjpbImVycm9yIl0sInZhbGlkLXR5cGVvZiI6WyJlcnJvciJdLCJuby11bnVzZWQtcHJpdmF0ZS1jbGFzcy1tZW1iZXJzIjpbImVycm9yIl19fX0=) class). This makes it difficult to refactor existing code.

```js
// flagged
const unusedVar = 123;

class MyClass {
  // not flagged
  static unusedStaticProperty = 6;

  constructor() {
    // not flagged
    this.unusedProperty = 5;
  }
  
  // not flagged
  unusedMethod() {
    
  }
}

new MyClass();
```

### Not hoisted up

As JavaScript developers, we expect functions (that are blocks of code) to be hoisted up in their own lexical scope. Sadly, classes do not share this same property, which leads to workarounds like these:

```js
var MyClass = class MyClassInternal {
  // ...
};
```

This is not an issue when using module-oriented development. But if you are not using modules, then this becomes a hassle.

## Example

Here is an example class that we can rewrite:

```js
class Dog {
  static AVERAGE_HEIGHT_FT = 4;
  static AVERAGE_WEIGHT_KG = 100;
  static _PRIVATE_MAGIC_HEIGHT = 3.14;

  constructor(height, weight) {
    this.height = height;
    this.weight = weight;
    if (this.height === this._PRIVATE_MAGIC_HEIGHT) {
      this._privateMakeTaller();
    }
  }

  _privateMakeTaller() {
    this.height = Dog.AVERAGE_HEIGHT_FT + 1;
  }

  printHeight() {
    const status = this.height > Dog.AVERAGE_HEIGHT_FT ? 'taller' : 'not taller';
    console.log(`Your dog is ${this.height} ft tall. The dog is ${status} than the average height`);
  }

  static getAverageHeight() {
    console.log(`Average height for dogs is ${Dog.AVERAGE_HEIGHT_FT} ft`);
  }
}
```

This code has a mix of static and instance-level methods and properties. Let us assume we want to expose only three methods: `constructor`, `printHeight` and `getAverageHeight`. Notice the weight properties are unused, which we might automatically detect in our re-written version. We also have a secret method and a secret property, that we want to encapsulate well.

## Closures to the rescue!

JavaScript closures are amazing. We can use them to emulate static properties, instance properties, private properties, as well as readonly properties. Here's the rewritten version of the above class:

```js
const Dog = (function createDogClass() {
  const AVERAGE_HEIGHT_FT = 4;
  const AVERAGE_WEIGHT_KG = 100;
  const _PRIVATE_MAGIC_HEIGHT = 3.14;

  function init(heightInput, weightInput) {
    let height = heightInput;
    const weight = weightInput;
    if (height === _PRIVATE_MAGIC_HEIGHT) {
      _privateMakeTaller();
    }

    function _privateMakeTaller() {
      height = AVERAGE_HEIGHT_FT + 1;
    }

    function printHeight() {
      const status = height > AVERAGE_HEIGHT_FT ? 'taller' : 'not taller';
      console.log(`Your dog is ${height} ft tall. The dog is ${status} than the average height`);
    }

    return {
      printHeight,
    };
  }

  function getAverageHeight() {
    console.log(`Average height for dogs is ${AVERAGE_HEIGHT_FT} kg`);
  }

  return {
    init,
    getAverageHeight,
  };
})();
```

Immediately, we see several advantages:

1. Unused properties are flagged by eslint ([see example](https://eslint.org/play/#eyJ0ZXh0IjoiY29uc3QgRG9nID0gKCgpID0+IHtcbiAgY29uc3QgQVZFUkFHRV9IRUlHSFRfRlQgPSA0O1xuICBjb25zdCBBVkVSQUdFX1dFSUdIVF9LRyA9IDEwMDtcbiAgY29uc3QgX1BSSVZBVEVfTUFHSUNfSEVJR0hUID0gMy4xNDtcblxuICBmdW5jdGlvbiBpbml0KGhlaWdodElucHV0LCB3ZWlnaHRJbnB1dCkge1xuICAgIGxldCBoZWlnaHQgPSBoZWlnaHRJbnB1dDtcbiAgICBjb25zdCB3ZWlnaHQgPSB3ZWlnaHRJbnB1dDtcbiAgICBpZiAoaGVpZ2h0ID09PSBfUFJJVkFURV9NQUdJQ19IRUlHSFQpIHtcbiAgICAgIF9wcml2YXRlTWFrZVRhbGxlcigpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIF9wcml2YXRlTWFrZVRhbGxlcigpIHtcbiAgICAgIGhlaWdodCA9IEFWRVJBR0VfSEVJR0hUX0ZUICsgMTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwcmludEhlaWdodCgpIHtcbiAgICAgIGNvbnN0IHN0YXR1cyA9IGhlaWdodCA+IEFWRVJBR0VfSEVJR0hUX0ZUID8gJ3RhbGxlcicgOiAnbm90IHRhbGxlcic7XG4gICAgICBjb25zb2xlLmxvZyhgWW91ciBkb2cgaXMgJHtoZWlnaHR9IGZ0IHRhbGwuIFRoZSBkb2cgaXMgJHtzdGF0dXN9IHRoYW4gdGhlIGF2ZXJhZ2UgaGVpZ2h0YCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIHByaW50SGVpZ2h0LFxuICAgIH07XG4gIH1cblxuICBmdW5jdGlvbiBnZXRBdmVyYWdlSGVpZ2h0KCkge1xuICAgIGNvbnNvbGUubG9nKGBBdmVyYWdlIGhlaWdodCBmb3IgZG9ncyBpcyAke0FWRVJBR0VfSEVJR0hUX0ZUfSBrZ2ApO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBpbml0LFxuICAgIGdldEF2ZXJhZ2VIZWlnaHQsXG4gIH07XG59KSgpOyIsIm9wdGlvbnMiOnsiZW52Ijp7ImVzNiI6dHJ1ZX0sInBhcnNlck9wdGlvbnMiOnsiZWNtYUZlYXR1cmVzIjp7fSwiZWNtYVZlcnNpb24iOiJsYXRlc3QiLCJzb3VyY2VUeXBlIjoic2NyaXB0In0sInJ1bGVzIjp7ImNvbnN0cnVjdG9yLXN1cGVyIjpbImVycm9yIl0sImZvci1kaXJlY3Rpb24iOlsiZXJyb3IiXSwiZ2V0dGVyLXJldHVybiI6WyJlcnJvciJdLCJuby1hc3luYy1wcm9taXNlLWV4ZWN1dG9yIjpbImVycm9yIl0sIm5vLWNhc2UtZGVjbGFyYXRpb25zIjpbImVycm9yIl0sIm5vLWNsYXNzLWFzc2lnbiI6WyJlcnJvciJdLCJuby1jb21wYXJlLW5lZy16ZXJvIjpbImVycm9yIl0sIm5vLWNvbmQtYXNzaWduIjpbImVycm9yIl0sIm5vLWNvbnN0LWFzc2lnbiI6WyJlcnJvciJdLCJuby1jb25zdGFudC1jb25kaXRpb24iOlsiZXJyb3IiXSwibm8tY29udHJvbC1yZWdleCI6WyJlcnJvciJdLCJuby1kZWJ1Z2dlciI6WyJlcnJvciJdLCJuby1kZWxldGUtdmFyIjpbImVycm9yIl0sIm5vLWR1cGUtYXJncyI6WyJlcnJvciJdLCJuby1kdXBlLWNsYXNzLW1lbWJlcnMiOlsiZXJyb3IiXSwibm8tZHVwZS1lbHNlLWlmIjpbImVycm9yIl0sIm5vLWR1cGUta2V5cyI6WyJlcnJvciJdLCJuby1kdXBsaWNhdGUtY2FzZSI6WyJlcnJvciJdLCJuby1lbXB0eSI6WyJlcnJvciJdLCJuby1lbXB0eS1jaGFyYWN0ZXItY2xhc3MiOlsiZXJyb3IiXSwibm8tZW1wdHktcGF0dGVybiI6WyJlcnJvciJdLCJuby1leC1hc3NpZ24iOlsiZXJyb3IiXSwibm8tZXh0cmEtYm9vbGVhbi1jYXN0IjpbImVycm9yIl0sIm5vLWV4dHJhLXNlbWkiOlsiZXJyb3IiXSwibm8tZmFsbHRocm91Z2giOlsiZXJyb3IiXSwibm8tZnVuYy1hc3NpZ24iOlsiZXJyb3IiXSwibm8tZ2xvYmFsLWFzc2lnbiI6WyJlcnJvciJdLCJuby1pbXBvcnQtYXNzaWduIjpbImVycm9yIl0sIm5vLWlubmVyLWRlY2xhcmF0aW9ucyI6WyJlcnJvciJdLCJuby1pbnZhbGlkLXJlZ2V4cCI6WyJlcnJvciJdLCJuby1pcnJlZ3VsYXItd2hpdGVzcGFjZSI6WyJlcnJvciJdLCJuby1sb3NzLW9mLXByZWNpc2lvbiI6WyJlcnJvciJdLCJuby1taXNsZWFkaW5nLWNoYXJhY3Rlci1jbGFzcyI6WyJlcnJvciJdLCJuby1taXhlZC1zcGFjZXMtYW5kLXRhYnMiOlsiZXJyb3IiXSwibm8tbmV3LXN5bWJvbCI6WyJlcnJvciJdLCJuby1ub25vY3RhbC1kZWNpbWFsLWVzY2FwZSI6WyJlcnJvciJdLCJuby1vYmotY2FsbHMiOlsiZXJyb3IiXSwibm8tb2N0YWwiOlsiZXJyb3IiXSwibm8tcHJvdG90eXBlLWJ1aWx0aW5zIjpbImVycm9yIl0sIm5vLXJlZGVjbGFyZSI6WyJlcnJvciJdLCJuby1yZWdleC1zcGFjZXMiOlsiZXJyb3IiXSwibm8tc2VsZi1hc3NpZ24iOlsiZXJyb3IiXSwibm8tc2V0dGVyLXJldHVybiI6WyJlcnJvciJdLCJuby1zaGFkb3ctcmVzdHJpY3RlZC1uYW1lcyI6WyJlcnJvciJdLCJuby1zcGFyc2UtYXJyYXlzIjpbImVycm9yIl0sIm5vLXRoaXMtYmVmb3JlLXN1cGVyIjpbImVycm9yIl0sIm5vLXVuZGVmIjpbImVycm9yIl0sIm5vLXVuZXhwZWN0ZWQtbXVsdGlsaW5lIjpbImVycm9yIl0sIm5vLXVucmVhY2hhYmxlIjpbImVycm9yIl0sIm5vLXVuc2FmZS1maW5hbGx5IjpbImVycm9yIl0sIm5vLXVuc2FmZS1uZWdhdGlvbiI6WyJlcnJvciJdLCJuby11bnNhZmUtb3B0aW9uYWwtY2hhaW5pbmciOlsiZXJyb3IiXSwibm8tdW51c2VkLWxhYmVscyI6WyJlcnJvciJdLCJuby11bnVzZWQtdmFycyI6WyJlcnJvciJdLCJuby11c2VsZXNzLWJhY2tyZWZlcmVuY2UiOlsiZXJyb3IiXSwibm8tdXNlbGVzcy1jYXRjaCI6WyJlcnJvciJdLCJuby11c2VsZXNzLWVzY2FwZSI6WyJlcnJvciJdLCJuby13aXRoIjpbImVycm9yIl0sInJlcXVpcmUteWllbGQiOlsiZXJyb3IiXSwidXNlLWlzbmFuIjpbImVycm9yIl0sInZhbGlkLXR5cGVvZiI6WyJlcnJvciJdLCJuby11bnVzZWQtcHJpdmF0ZS1jbGFzcy1tZW1iZXJzIjpbImVycm9yIl19fX0=))
2. Webpack optimizes our code with variable renaming and dead code removal.
3. We have lesser code bloat thanks to removing `this.` and `Dog.` prefixes.
4. <s>Our private and readonly properties are truly private and readonly now.</s> As we discussed earlier, regular classes also support this.

## How does this work?

### Static scope

The scope inside `createDogClass` is the `static` scope. Variables and functions declared in this scope are shared by all instances. From this scope, we return an object of properties that are exposed externally. In this case, we return:

1. `init` which acts as our constructor, and
2. `getAverageHeight` which lets the users know the average height of dogs.

Notice how:

1. the magic height property is private, and
2. the average height property is public (exposed via `getAverageHeight`) but readonly

### Instance-level scope

We replaced the `constructor` with an `init` function that does the same job. Now, to create an instance, we call `Dog.init(...)` (instead of `new Dog(...)`). Note that each invocation of `init` returns a new object instance, which also comes up with a separate lexical scope (very handy for us!)

From inside `init`, we return all publicly exposed properties. In this case, we only expose `printHeight`.  Notice how:

1. `_privateMakeTaller` is a private method, and unique for every instance of `Dog`
2. the static properties from `Dog` scope are easily accessible.
3. `height` and `weight` values are not shared across instances (unique per instance)

## Conclusion

I hope this post helped you understand how to rewrite JavaScript `class` syntax into closures.

## Post conclusion

Motivated by the HN comments, here's some additional considerations when using closure syntax to emulate classes:

1. Developer experience takes a hit because now the `instanceof` check no longer works. Further, the syntax `Dog.init` might be strange to use instead of the familiar `new Dog`
2. Every new object ships with a copy of all the methods, which is bad for memory optimization of the program.

Also, I don't recommend that we start switching all classes to closures straightaway. With this blog post, I want to highlight the difference between the class pattern vs the closure pattern, and how each of them have their differences and advantages. The choice of which one to use is ultimately yours to make.

## Further discussion

Mika Genic reached out to me via e-mail to provide a clever design that clearly defines a public interface while also avoiding an IIFE. Here's an example:

```js
function Dog(name) {
  // define public interface
  const self = Object.assign(this, {
    publicFn1,
  })

  // init private state
  let created = new Date()
 
  // call constructor
  constructor()

  return self
 
  // logic
  function constructor() { console.log(`dog created`) }
  function publicFn1() { console.log(`${privateFn1()}`) }
  function privateFn1() { return `${name} ${created}` }
}

let dog = new Dog(`Billy`)
dog.publicFn1()
```

Note that:

1. there is no IIFE, which makes understanding the code far simpler.
2. the public interface is clearly separated from the rest of the logic
3. You can use the traditional `new` keyword to construct objects from this class.
4. You can avoid `this` entirely.

Some readers will notice that this is very similar to the pre-ES6 way of declaring classes. Here's an [example post on StackOverflow](https://stackoverflow.com/a/387733).