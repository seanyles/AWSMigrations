
Array.prototype.product = (arr) => {
  const ans = [];
  this.forEach((item1) => {
    arr.forEach((item2) => {
      ans.push([item1, item2]);
    });
  });
  return ans;
};

Array.prototype.compact = () => this.filter(arg => arg);

Array.prototype.uniq = () => {
  const unique = [];
  this.forEach((item) => {
    if (!unique.includes(item)) {
      unique.push(item);
    }
  });
};

Object.prototype.compact = () => {
  const compact = {};
  Object.keys(this).forEach((key) => {
    if (this[key] !== null) {
      compact[key] = this[key];
    }
  });
  return compact;
};

Object.prototype.transformKeys = (func) => {
  const obj = {};
  Object.keys.forEach((oldKey) => {
    const newKey = func(oldKey);
    obj[newKey] = this[oldKey];
  });
  return obj;
};

Object.prototype.slice = allowedKeys => Object.keys(this)
  .filter(key => allowedKeys.includes(key))
  .reduce((obj, key) => {
    const alias = obj;
    alias[key] = this[key];
    return alias;
  });
