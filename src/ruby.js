
module.exports.product = (arr1, arr2) => {
  const ans = [];
  arr1.forEach((item1) => {
    arr2.forEach((item2) => {
      ans.push([item1, item2]);
    });
  });
  return ans;
};

Array.prototype.product = (arr) => {
  const ans = [];
  this.forEach((item1) => {
    arr.forEach((item2) => {
      ans.push([item1, item2]);
    });
  });
  return ans;
};

/*
module.exports.reduce = (arr, func) => {
  if (arr.length < 2) {
    return arr;
  }
  let acc = arr[0];
  for (let i = 1; i < arr.length; i += 1) {
    acc = func(acc, arr[i]);
  }
  return acc;
};
*/

module.exports.compact = arr => arr.filter(arg => arg);

module.exports.uniq = (arr) => {
  const unique = [];
  arr.forEach((item) => {
    if (!unique.includes(item)) {
      unique.push(item);
    }
  });
  return unique;
};

module.exports.compactObj = (obj) => {
  const compact = {};
  Object.keys(obj).forEach((key) => {
    if (obj[key] !== null) {
      compact[key] = obj[key];
    }
  });
  return compact;
};

module.exports.transformKeys = (raw, func) => {
  const obj = {};
  Object.keys.forEach((oldKey) => {
    const newKey = func(oldKey);
    obj[newKey] = raw[oldKey];
  });
  return obj;
};

module.exports.eachFlatten = (set) => {
  set.map(item => item.flat());
};

module.exports.slice = (raw, allowedKeys) => Object.keys(raw)
  .filter(key => allowedKeys.includes(key))
  .reduce((obj, key) => {
    const alias = obj;
    alias[key] = raw[key];
    return alias;
  });
