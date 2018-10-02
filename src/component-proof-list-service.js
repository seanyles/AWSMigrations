
const rubify = require('../ruby-magic').rubify;

const PROOF_COL = 'last';
const SINGLE_PRINT_VERSION = 'Single Print Version';

let allRows;
let component;

function call(comp, rows) {
  component = comp;
  allRows = rows;
  const list = [];
  uniqueValueCombination().forEach((uniqueSet) => {
    const innerRows = gatherMatchingRows(uniqueSet).filter(row => checkUniqueValues(row));
    if (innerRows.length > 0) {
      const longest = findLongest(innerRows);
      if (longest && !list.includes(longest)) {
        list.push(longest);
      }
    }
  });
  return list;
}

module.exports = call;

function gatherMatchingRows(uniqueSet) {
  let innerRows = allRows;
  rubify(uniqueSet).compactR().forEachWithRubify((set) => {
    set.compactR().keys().forEach((key) => {
      if (allRows.length > 0 && set.get(key) !== SINGLE_PRINT_VERSION) {
        innerRows = innerRows.filter((row) => {
          const value = rubify(getCasecmpValue(row, key));
          const setValue = getCasecmpValue(set, key);
          if (value && setValue) {
            return value.casecmp(setValue) === 0;
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
  const values = rubify(row).sliceR(variables).valuesR().compact()
    .filter(item => !Array.isArray(item) || item.length > 0);
  return values.length === rubify(values).uniq().length;
}

function getCasecmpValue(row, key) {
  return rubify(row).compactR().transformKeys(rowKey => rowKey.toLowerCase())[key.toLowerCase()];
}

function uniqueValueCombination() {
  const personals = rubify(personalSegmentUniqueVals());
  const indesigns = rubify(indesignUniqueVals());
  const creatives = rubify(creativeSegmentUniqueVals());
  if (personals.length() > 0 && indesigns.length() > 0) {
    return eachFlatten(creatives.productR(personals).product(indesigns));
  } if (personals.length() > 0) {
    return eachFlatten(creatives.product(personals));
  } if (indesigns.length() > 0) {
    return creatives.product(indesigns);
  }
  return creatives.map(c => [c]);
}

function findLongest(rows) {
  return rubify(rows).maxBy(row => row[PROOF_COL].toString().length);
}

function creativeSegmentUniqueVals() {
  return component.creativeSegments.map((cs) => {
    const headerName = {};
    headerName[cs.associatedHeader] = cs.name;
    return headerName;
  });
}

function indesignUniqueVals() {
  const rows = rubify(allRows);
  return rubify(component.indesignLayerKeys).mapR(key => rows
    .mapR(j => rubify(j).compactR().transformKeys(jKey => jKey.toLowerCase())[key.toLowerCase()])
    .uniqR().map((value) => {
      const obj = {};
      obj[key] = value;
      return obj;
    })).flatten();
}

function personalSegmentUniqueVals() {
  if (component.personalSegments.length === 0) { return []; }
  const personals = component.personalSegments.map((ps) => {
    if (ps.values.length !== 0) {
      return Object.keys(ps.values).map((value) => {
        const obj = {};
        obj[ps.associatedHeader] = value;
        return obj;
      });
    } return null;
  });
  return rubify(personals).compactR().reduce((acc, personal) => rubify(acc).product(personal));
}

function eachFlatten(set) {
  return set.map(item => rubify(item).flatten());
}
