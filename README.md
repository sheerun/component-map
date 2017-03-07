# Component Map [![Build Status](https://travis-ci.org/sheerun/component-map.svg?branch=master)](https://travis-ci.org/sheerun/component-map) [![npm](https://img.shields.io/npm/v/component-map.svg)]()

> Not invasive, performant, and garbage collected storage for React components (and more)

`ComponentMap` allows for most operations [WeakMap](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/WeakMap) provides, but it's not a 1:1 shim. In particular, to simplify the implementation it doesn't accept iterable object as a constructor parameter.

`ComponentMap` it is preconfigured for performant mapping of React classes, but can be easily customized.

`ComponentMap` promises following:

- **No mutation of provided keys whatsoever** (in contrast to most other WeakMap shims)
- Efficient garbage collection of components if provided with proper WeakMap implementation
- Decent retrieval performance if no WeakMap is provided

Unfortunately given first promise, it's not possible to prevent memory pollution in case `WeakMap` is provided. For this reason `ComponentMap` can be used without `WeakMap` option only in short-lived sessions, like development or tests.

## Usage

Component Map supports subset of WeakMap API

* `new ComponentMap(options: object)` Create a new ComponentMap. Accepts following options:
  * `WeakMap: WeakMap` - an implementation of WeakMap to use, or undefined if to use bucketed implementation
  * `getBucketName: (object) => string` - it can be used to configure bucket names (see Configuraton section below)
* `ComponentMap#get(key: object): any` Returns the value that key corresponds to the key or undefined.
* `ComponentMap#has(key: object): boolean` Tells whether there exists a value with given key
* `ComponentMap#set(key: object, value: any)` Sets key to given value. The key must be an object.
* `ComponentMap#delete(key: object): boolean` Removes the value and returns true if there was a value to delete.


The `key` option must be an object, by default ComponentMap is optimized to store React components.

## Example

```js
class MyComponent { render() { return <div>Hello world</div> } }

const components = new ComponentMap({ WeakMap })
components.set(MyComponent, { metadata: 'something' })
// somewhere else
const meta = components.get(MyComponent).metadata
```


## Configuration

If you wish to use objects other than React components as keys, you can use `getBucketName`. It allows for specifying custom bucket names. See how `ComponentMap` is a subclass of `BucketMap`:

```js
class MyObject {
  static type = 'MyObject'
}

class myMap = new ComponentMap({ getBucketName: (key => key.type) })
myMap.set(MyObject, 'something')
```

## How it works

By default it tries to store components directly into passed `WeakMap`, if provided. Otherwise it uses custom storage that puts objects into buckets instead of single map, improving retrieval performance a lot. Something like `buckets[getBucketName(key)] = value`.

`ComponentMap` doesn't automatically detect `WeakMap` implementation, but rather allows you to pass it as a constructor parameter. It uses bucketed storage implementation only in case `WeakMap` is not provided.

## License

MIT
