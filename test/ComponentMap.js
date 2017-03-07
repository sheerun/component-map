import test from "ava";
import React from "react";

import ComponentMap, { BucketMap } from "../src/ComponentMap";
import { tenmegabyte, allocatedMemory } from "./_helpers";

test("is a function", t => {
  t.is(typeof ComponentMap, "function");
});

const Component = React.createClass({
  displayName: "Component",
  render: function() {
    return null;
  }
});

const InvalidBucketName = { displayName: undefined };

function testImplementation(test) {
  test("#get returns undefined by default", t => {
    const map = new ComponentMap({ WeakMap });
    t.is(map.get(Component), undefined);
  });

  test("#has returns false by default", t => {
    const map = new ComponentMap({ WeakMap });
    t.is(map.has(Component), false);
  });

  test("#get returns undefined if bucket name is invalid", t => {
    const map = new ComponentMap({ WeakMap });
    t.is(map.get(InvalidBucketName), undefined);
  });

  test("#jas returns undefined if bucket name is invalid", t => {
    const map = new ComponentMap({ WeakMap });
    t.is(map.has(InvalidBucketName), false);
  });

  test("#set and #get allow for saving and retrieving values", t => {
    const map = new ComponentMap({ WeakMap });
    map.set(Component, "bar");
    t.is(map.get(Component), "bar");
  });

  test("#set and #has allow for saving and knowing whether value exists", t => {
    const map = new ComponentMap({ WeakMap });
    map.set(Component, "bar");
    t.is(map.has(Component), true);
  });

  test("#delete allows for deleting values", t => {
    const map = new ComponentMap({ WeakMap });
    map.set(Component, "bar");
    map.delete(Component);
    t.is(map.get(Component), undefined);
  });

  if (!global.gc) {
    test.todo("It is recommended to run test suite with --expose-gc flag!");
  } else {
    test("releases memory when scope that created ComponentMap exits", t => {
      return allocatedMemory(function() {
        const map = new ComponentMap({ WeakMap });
        map.set(Component, tenmegabyte());
      }).then(heapUsed => {
        t.is(heapUsed, 0);
      });
    });
  }
}

[
  { WeakMap: undefined, note: "(shim)" },
  { WeakMap: WeakMap, note: "(native)" }
].forEach(({ WeakMap, note }) => {
  testImplementation((title, fn) => test(`${title} ${note}`, fn));
});

if (WeakMap && global.gc) {
  test("releases memory for expired keys (only native)", t => {
    const map = new ComponentMap({ WeakMap });

    return allocatedMemory(function() {
      const Bar = React.createClass({ render: function() {} });
      map.set(Bar, tenmegabyte());
    }).then(heapUsed => {
      t.is(heapUsed, 0);
    });
  });

  test("releases memory for deleted keys (only native)", t => {
    const map = new ComponentMap({ WeakMap });

    let Bar = React.createClass({ render: function() {} });

    return allocatedMemory(function() {
      map.set(Bar, tenmegabyte());
      Bar = null;
    }).then(heapUsed => {
      t.is(heapUsed, 0);
    });
  });
}

test("ComponentMap is subtype of BucketMap", t => {
  const map = new ComponentMap();
  t.truthy(map instanceof BucketMap);
});

test("BucketMap throws if not passed getBucketName", t => {
  t.throws(() => new BucketMap());
});

test("BucketMap allows for custom getBucketname", t => {
  const object = { lol: "foo" };
  const map = new BucketMap({ getBucketName: key => key.lol });
  map.set(object, "bar");
  t.is(map.get(object), "bar");
});
