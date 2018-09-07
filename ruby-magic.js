
if (!Array.prototype.product) {
  Array.prototype.product = function product(arr) {
    const ans = [];
    this.forEach((item1) => {
      arr.forEach((item2) => {
        ans.push([item1, item2]);
      });
    });
    return ans;
  };
}

if (!Array.prototype.compact) {
  Array.prototype.compact = function compact() {
    return this.filter(arg => arg);
  };
}

if (!Array.prototype.uniq) {
  Array.prototype.uniq = function uniq() {
    const unique = [];
    this.forEach((item) => {
      if (!unique.includes(item)) {
        unique.push(item);
      }
    });
  };
}

if (!Array.prototype.flatten) {
  Array.prototype.flatten = function flatten(depth) {
    const flat = [];
    this.forEach((item) => {
      if (!Array.isArray(item) || depth === 0) {
        flat.push(item);
      } else if (depth > 0) {
        flat.push(...item.flatten(depth - 1));
      } else {
        flat.push(...item.flatten());
      }
    });
    return flat;
  };
}

if (!Object.prototype.compact) {
  Object.prototype.compact = function compact() {
    const ans = {};
    Object.keys(this).forEach((key) => {
      if (this[key] !== null) {
        ans[key] = this[key];
      }
    });
    return ans;
  };
}

if (!Object.prototype.transformKeys) {
  Object.prototype.transformKeys = function transformKeys(func) {
    const obj = {};
    Object.keys(this).forEach((oldKey) => {
      const newKey = func(oldKey);
      obj[newKey] = this[oldKey];
    });
    return obj;
  };
}

if (!Object.prototype.slice) {
  Object.prototype.slice = function slice(allowedKeys) {
    return Object.keys(this)
      .filter(key => allowedKeys.includes(key))
      .reduce((obj, key) => {
        const alias = obj;
        alias[key] = this[key];
        return alias;
      });
  };
}

if (!String.prototype.casecmp) {
  String.prototype.casecmp = function casecmp(other) {
    const self = this.toLowerCase();
    const otherStr = other.toLowerCase();
    if (self === otherStr) {
      return 0;
    } if (self.contains(otherStr)) {
      return 1;
    }
    return -1;
  };
}
