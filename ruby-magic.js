
class Ruby {
  constructor(value) {
    this.value = value;
  }

  class() {
    return typeof this.value;
  }

  derubify() {
    return this.value;
  }

  toString() {
    if (this.value === null || this.value === undefined) {
      return '';
    } return this.value.toString();
  }

  Boolean() {
    return Boolean(this.value);
  }
}

class RubyArray extends Ruby {
  static class() {
    return 'array';
  }

  length() {
    return this.value.length;
  }

  index(n) {
    return this.value[n];
  }

  first() {
    return this.value[0];
  }

  last() {
    return this.value[this.value.length - 1];
  }

  second() {
    return this.value[1];
  }

  third() {
    return this.value[2];
  }

  fourth() {
    return this.value[3];
  }

  fifth() {
    return this.value[4];
  }

  sixth() {
    return this.value[5];
  }

  seventh() {
    return this.value[6];
  }

  eighth() {
    return this.value[7];
  }

  ninth() {
    return this.value[8];
  }

  product(arr) {
    const array = degem(arr);
    const ans = [];
    this.value.forEach((item1) => {
      array.forEach((item2) => {
        ans.push([item1, item2]);
      });
    });
    return rubify(ans);
  }

  uniq() {
    const unique = [];
    this.value.forEach((item) => {
      if (!unique.includes(item)) {
        unique.push(item);
      }
    });
    return rubify(unique);
  }

  flatten(depth) {
    const flat = [];
    const d = degem(depth);
    this.value.forEach((item) => {
      if (!Array.isArray(item) || d === 0) {
        flat.push(item);
      } else if (d > 0) {
        flat.push(...item.flattenR(d - 1));
      } else {
        flat.push(...item.flattenR());
      }
    });
    return rubify(flat);
  }

  maxBy(func) {
    return rubify(this.value.reduce((winner, contender) => {
      if (func(contender) > func(winner)) {
        return contender;
      } return winner;
    }));
  }

  minBy(func) {
    if (this.value.length === 0) { return null; }
    return rubify(this.value.reduce((winner, contender) => {
      if (func(contender) < func(winner)) {
        return contender;
      } return winner;
    }));
  }

  eachWithObject(acc, func) {
    const accumulator = degem(acc);
    this.value.forEach(value => func(value, accumulator));
    return rubify(accumulator);
  }

  forEachWithRubify(func) {
    this.value.forEach(item => func(rubify(item)));
  }

  merge(other) {
    degem(other).forEach(val => (this.value.includes(val) ? null : this.value.push(val)));
  }

  compact() {
    return rubify(this.value.filter(arg => arg));
  }
}

class RubyString extends Ruby {
  length() {
    return this.value.length;
  }

  casecmp(other) {
    const self = this.value.toLowerCase();
    const otherStr = other.toLowerCase();
    if (self === otherStr) {
      return rubify(0);
    } if (self.includes(otherStr)) {
      return rubify(1);
    } return rubify(-1);
  }
}

class RubyHash extends Ruby {
  constructor(hash) {
    super(hash);
    Object.keys(this.value).forEach((key) => {
      this[key] = this.value[key];
    });
  }

  compact() {
    const ans = {};
    Object.keys(this.value).forEach((key) => {
      if (this.value[key] !== null) {
        ans[key] = this.value[key];
      }
    });
    return rubify(ans);
  }

  transformKeys(func) {
    const obj = {};
    Object.keys(this.value).forEach((oldKey) => {
      const newKey = func(oldKey);
      obj[newKey] = this.value[oldKey];
    });
    return rubify(obj);
  }

  slice(keys) {
    const allowedKeys = degem(keys);
    const obj = {};
    Object.keys(this.value)
      .filter(key => allowedKeys.includes(key)).forEach((key) => {
        obj[key] = this.value[key];
      });
    return rubify(obj);
  }

  values() {
    const vals = [];
    Object.keys(this.value).forEach(key => vals.push(this.value[key]));
    return rubify(vals);
  }

  keys() {
    return rubify(Object.keys(this.value));
  }

  get(key) {
    return this.value[key];
  }
}

class RubyNumber extends Ruby {}

class RubyBoolean extends Ruby {}

function degem(param) {
  if (param instanceof Ruby) {
    return param.derubify();
  } return param;
}

function inherit(jsParent, rubyChild) {
  Object.getOwnPropertyNames(jsParent)
    .filter(p => !Object.getOwnPropertyNames(rubyChild).includes(p))
    .forEach((p) => {
      if (typeof jsParent[p] === 'function') {
        rubyChild[p] = function (...args) {
          const degemmed = args.map(arg => degem(arg));
          return rubify(jsParent[p].apply(this.value, degemmed));
        };
      }
    });
}

inherit(Array.prototype, RubyArray.prototype);
inherit(Number.prototype, RubyNumber.prototype);
inherit(Boolean.prototype, RubyBoolean.prototype);
inherit(String.prototype, RubyString.prototype);
inherit(Object.prototype, RubyHash.prototype);

function rubify(value) {
  if (value instanceof Ruby) return value;
  switch (typeof value) {
    case 'object':
      if (value === null) return new Ruby(null);
      if (Array.isArray(value)) return new RubyArray(value);
      return new RubyHash(value);
    case 'number':
      return new RubyNumber(value);
    case 'string':
      return new RubyString(value);
    case 'boolean':
      return new RubyBoolean(value);
    case 'function':
      return value;
    default:
      return new Ruby(value);
  }
}

module.exports.rubify = rubify;
