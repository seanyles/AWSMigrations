
// const ruby = require('./ruby');
const ruby = require('../ruby');

const PROOF_COL = 'last';
const SINGLE_PRINT_VERSION = 'Single Print Version';

let allRows; // array of hashes
let component;

function call(comp, rows) {
  component = comp;
  allRows = rows;
  const list = [];
  uniqueValueCombination().forEach((uniqueSet) => {
    gatherMatchingRows(uniqueSet).filter(row => checkUniqueValues(row));
  });
}

module.exports = call;

function gatherMatchingRows(uniqueSet) {
  let innerRows = allRows;
  ruby.compact(uniqueSet).forEach((set) => {
    Object.keys(ruby.compact(set)).forEach((key) => {
      if (allRows.length > 0 && set[key] !== SINGLE_PRINT_VERSION) {
        innerRows = innerRows.filter((row) => {
          const value = getCasecmpValue(row, key);
          const setValue = getCasecmpValue(set, key);
          if (value && setValue) {
            return casecmp(setValue) === 0;
          }
          return false;
        });
      }
    });
  });
  return innerRows;
}

function checkUniqueValues(row) {
  // component.plan&.variables
  const variables = component.variables.map(variable => variable.toLowerCase());
  const values = ruby.slice(row, variables);
  return values.length === ruby.uniq(values).length;
}

function getCasecmpValue(row, key) {
  ruby.compact(row);
}

async function uniqueValueCombination() {
  const personals = await personalSegmentUniqueVals();
  const indesigns = await indesignUniqueVals();
  const creatives = await creativeSegmentUniqueVals();
  if (personals.length > 0 && indesigns.length > 0) {
    return eachFlatten(ruby.product(ruby.product(creatives, personals), indesigns));
  } if (personals.length > 0) {
    return eachFlatten(ruby.product(creatives, personals));
  } if (indesigns.length > 0) {
    return ruby.product(creatives, indesigns);
  }
  return creatives.map(c => [c]);
}

function creativeSegmentUniqueVals() {
  return component.creativeSegments.map((cs) => {
    const headerName = {};
    headerName[cs.associatedHeader] = cs.name;
    return headerName;
  });
}

function indesignUniqueVals() {
  const indesigns = component.indesignLayerKeys.map((key) => {
    const indesign = allRows.map((j) => {
      const lowCaseObj = ruby.transformKeys(ruby.compactObj(j), String.toLowerCase());
      return ruby.uniq(lowCaseObj[key.toLowerCase()]).map((value) => {
        const keyVal = {};
        keyVal[key] = value;
        return keyVal;
      });
    });
    return indesign;
  });
  return indesigns.flat();
}

function personalSegmentUniqueVals() {
  if (component.personalSegments.length === 0) {
    return [];
  }
  const personals = component.personalSegments.map((ps) => {
    if (ps.values.length !== 0) {
      return Object.keys(ps.values).map((value) => {
        const obj = {};
        obj[ps.associatedHeader] = value;
        return obj;
      });
    } return null;
  });
  return ruby.compact(personals).reduce((acc, personal) => {
    ruby.product(acc, personal);
  });
}

function eachFlatten(set) {
  set.map(item => item.flat());
}
