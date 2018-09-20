
require('../ruby-magic');

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
  uniqueSet.compactR().forEach((set) => {
    Object.keys(set.compactR()).forEach((key) => {
      if (allRows.length > 0 && set[key] !== SINGLE_PRINT_VERSION) {
        innerRows = innerRows.filter((row) => {
          const value = getCasecmpValue(row, key);
          const setValue = getCasecmpValue(set, key);
          if (value && setValue) {
            return value.casecmpR(setValue) === 0;
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
  const values = row.sliceR(variables).valuesR().compactR()
    .filter(item => !Array.isArray(item) || item.length > 0);
  return values.length === values.uniqR().length;
}

function getCasecmpValue(row, key) {
  return row.compactR().transformKeysR(rowKey => rowKey.toLowerCase())[key.toLowerCase()];
}

function uniqueValueCombination() {
  const personals = personalSegmentUniqueVals();
  const indesigns = indesignUniqueVals();
  const creatives = creativeSegmentUniqueVals();
  if (personals.length > 0 && indesigns.length > 0) {
    return eachFlatten(creatives.productR(personals).productR(indesigns));
  } if (personals.length > 0) {
    return eachFlatten(creatives.productR(personals));
  } if (indesigns.length > 0) {
    return creatives.productR(indesigns);
  }
  return creatives.map(c => [c]);
}

function findLongest(rows) {
  return rows.maxByR(row => row[PROOF_COL].toString().length);
}

function creativeSegmentUniqueVals() {
  return component.creativeSegments.map((cs) => {
    const headerName = {};
    headerName[cs.associatedHeader] = cs.name;
    return headerName;
  });
}

function indesignUniqueVals() {
  return component.indesignLayerKeys.map(key => allRows
    .map(j => j.compactR().transformKeysR(jKey => jKey.toLowerCase())[key.toLowerCase()])
    .uniqR().map((value) => {
      const obj = {};
      obj[key] = value;
      return obj;
    })).flattenR();
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
  return personals.compactR().reduce((acc, personal) => acc.productR(personal));
}

function eachFlatten(set) {
  return set.map(item => item.flattenR());
}
