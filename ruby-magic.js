
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
    return unique;
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

if (!Array.prototype.maxBy) {
  Array.prototype.maxBy = function maxBy(func) {
    return this.reduce((winner, contender) => {
      if (func(contender) > func(winner)) {
        return contender;
      } return winner;
    });
  };
}

if (!Array.prototype.minBy) {
  Array.prototype.minBy = function minBy(func) {
    if (this.length === 0) { return null; }
    return this.reduce((winner, contender) => {
      if (func(contender) < func(winner)) {
        return contender;
      } return winner;
    });
  };
}

if (!Array.prototype.eachWithObject) {
  Array.prototype.eachWithObject = function eachWithObject(acc, func) {
    this.forEach(value => func(value, acc));
    return acc;
  };
}

if (!Array.prototype.merge) {
  Array.prototype.merge = function merge(other) {
    other.forEach(value => (this.includes(value) ? null : this.push(value)));
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
    const obj = {};
    Object.keys(this)
      .filter(key => allowedKeys.includes(key)).forEach((key) => {
        obj[key] = this[key];
      });
    return obj;
  };
}

if (!Object.prototype.values) {
  Object.prototype.values = function values() {
    const vals = [];
    Object.keys(this).forEach(key => vals.push(this[key]));
    return vals;
  };
}

if (!String.prototype.casecmp) {
  String.prototype.casecmp = function casecmp(other) {
    const self = this.toLowerCase();
    const otherStr = other.toLowerCase();
    if (self === otherStr) {
      return 0;
    } if (self.includes(otherStr)) {
      return 1;
    } return -1;
  };
}
