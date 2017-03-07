class BucketStore {
  constructor(getBucketName) {
    this.buckets = {};
    this.getBucketName = getBucketName;
  }

  getBucket(maybeKey) {
    const key = this.getBucketName(maybeKey);

    if (!this.buckets[key]) {
      this.buckets[key] = { keys: [], values: [] };
    }

    return this.buckets[key];
  }

  get(key) {
    const bucket = this.getBucket(key);
    const index = bucket.keys.indexOf(key);

    if (index >= 0) {
      return bucket.values[index];
    }
  }

  has(key) {
    const bucket = this.getBucket(key);

    return bucket.keys.indexOf(key) >= 0;
  }

  set(key, value) {
    if (!key || (typeof key !== "object" && typeof key !== "function")) {
      throw new TypeError("Invalid value used as weak map key");
    }

    const bucket = this.getBucket(key);
    let index = bucket.keys.indexOf(key);

    if (index === -1) {
      index = bucket.keys.length;
      bucket.keys[index] = key;
      bucket.values[index] = value;
    }

    return this;
  }

  delete(key) {
    const bucket = this.getBucket(key);
    const index = bucket.keys.indexOf(key);

    if (index >= 0) {
      bucket.keys.splice(index, 1);
      bucket.values.splice(index, 1);
    }
  }
}

export class BucketMap {
  constructor(options = {}) {
    if (!options.getBucketName) {
      throw new TypeError("BucketMap constructor requires getBucketName param");
    }

    if (options.WeakMap) {
      this.store = new options.WeakMap();
    } else {
      this.store = new BucketStore(options.getBucketName);
    }
  }

  get(key) {
    return this.store.get(key);
  }

  has(key) {
    return this.store.has(key);
  }

  set(key, value) {
    return this.store.set(key, value);
  }

  delete(key) {
    return this.store.delete(key);
  }
}

export default class ComponentMap extends BucketMap {
  constructor(options = {}) {
    super(
      Object.assign({}, options, {
        getBucketName: options.getBucketName ||
          (key => key.displayName || key.name || "[anonymous]")
      })
    );
  }
}
