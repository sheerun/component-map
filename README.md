# Component Map

> A storage for (not only) React components backed by WeakMap and performant fallback

This module allows for most operations [WeakMap](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/WeakMap) provides, but it's not a 1:1 shim to make implementation more lightweight (in particular, it won't accept iterable object as a constructor parameter). On top of that, by default `ComponentMap` it is configured for performant storage of React classes, but can be easily easily customized with `getBucketName` option (see below).

## Usage

Component Map supports subset of WeakMap API

* `new ComponentMap(options: object)` Create a new ComponentMap. Accepts following options:
  * `WeakMap: WeakMap` - an implementation of WeakMap to use, or undefined if to use bucketed implementation
  * `getBucketName: (object) => string` - it can configure bucketed implementation (see Configuraton section below)
* `ComponentMap#get(key: object): any` Returns the value that key corresponds to the key or undefined.
* `ComponentMap#has(key: object): boolean` Tells whether there exists a value with given key
* `ComponentMap#set(key: object, value: any)` Sets key to given value. The key must be an object.
* `ComponentMap#delete(key: object): boolean` Removes the value and returns true if there was a value to delete.


The `key` option must be an object, and is expected to be a React component.

If you with to store values of other types, please instantiate BucketMap instead (see Bucketed Map section below).

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
