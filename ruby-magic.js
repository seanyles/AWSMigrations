
if (!Array.prototype.productR) {
  Array.prototype.productR = function productR(arr) {
    const ans = [];
    this.forEach((item1) => {
      arr.forEach((item2) => {
        ans.push([item1, item2]);
      });
    });
    return ans;
  };
}

if (!Array.prototype.compactR) {
  Array.prototype.compactR = function compactR() {
    return this.filter(arg => arg);
  };
}

if (!Array.prototype.uniq) {
  Array.prototype.uniqR = function uniqR() {
    const unique = [];
    this.forEach((item) => {
      if (!unique.includes(item)) {
        unique.push(item);
      }
    });
    return unique;
  };
}

if (!Array.prototype.flattenR) {
  Array.prototype.flattenR = function flattenR(depth) {
    const flat = [];
    this.forEach((item) => {
      if (!Array.isArray(item) || depth === 0) {
        flat.push(item);
      } else if (depth > 0) {
        flat.push(...item.flattenR(depth - 1));
      } else {
        flat.push(...item.flattenR());
      }
    });
    return flat;
  };
}

if (!Array.prototype.maxByR) {
  Array.prototype.maxByR = function maxByR(func) {
    return this.reduce((winner, contender) => {
      if (func(contender) > func(winner)) {
        return contender;
      } return winner;
    });
  };
}

if (!Array.prototype.minByR) {
  Array.prototype.minByR = function minByR(func) {
    if (this.length === 0) { return null; }
    return this.reduce((winner, contender) => {
      if (func(contender) < func(winner)) {
        return contender;
      } return winner;
    });
  };
}

if (!Array.prototype.eachWithObject) {
  Array.prototype.eachWithObjectR = function eachWithObjectR(acc, func) {
    this.forEach(value => func(value, acc));
    return acc;
  };
}

if (!Array.prototype.merge) {
  Array.prototype.mergeR = function mergeR(other) {
    other.forEach(value => (this.includes(value) ? null : this.push(value)));
  };
}

if (!Object.prototype.compactR) {
  Object.prototype.compactR = function compactR() {
    const ans = {};
    Object.keys(this).forEach((key) => {
      if (this[key] !== null) {
        ans[key] = this[key];
      }
    });
    return ans;
  };
}

if (!Object.prototype.transformKeysR) {
  Object.prototype.transformKeysR = function transformKeysR(func) {
    const obj = {};
    Object.keys(this).forEach((oldKey) => {
      const newKey = func(oldKey);
      obj[newKey] = this[oldKey];
    });
    return obj;
  };
}

if (!Object.prototype.sliceR) {
  Object.prototype.sliceR = function sliceR(allowedKeys) {
    const obj = {};
    Object.keys(this)
      .filter(key => allowedKeys.includes(key)).forEach((key) => {
        obj[key] = this[key];
      });
    return obj;
  };
}

if (!Object.prototype.valuesR) {
  Object.prototype.valuesR = function valuesR() {
    const vals = [];
    Object.keys(this).forEach(key => vals.push(this[key]));
    return vals;
  };
}

if (!String.prototype.casecmpR) {
  String.prototype.casecmpR = function casecmpR(other) {
    const self = this.toLowerCase();
    const otherStr = other.toLowerCase();
    if (self === otherStr) {
      return 0;
    } if (self.includes(otherStr)) {
      return 1;
    } return -1;
  };
}

module.exports.toStringR = function toStringR(obj) {
  if (obj === null || obj === undefined) {
    return '';
  } return obj.toString();
};
