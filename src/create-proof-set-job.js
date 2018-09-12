
const fs = require('fs');
const csv = require('fast-csv');
const componentProofList = require('./component-proof-list-service');

const FILE_NAME = 'proof_set_file';
const EXT = '.csv';
const MIN_REQUIRED = 10;

let data;

let listToProof;

function perform(event) {
  try {
    data = event;
    console.log(`CreateProofSetJob - perform on segmentID ${data.segment.id}`);
    saveToFile();
    console.log(`CreateProofSetJob - Proof set successfully created for segment ID, ${data.segment.id}`);
  } catch (err) {
    // Send an email?
    console.error(`ERROR: CreateProofSetJob - CreateProofSetJob - ${err} ${err.stack}, segment ID ${data.segment.id}`);
  }
}

module.exports = perform;

function generateListToProof() {
  if (!listToProof) {
    const list = [];
    data.components.forEach((component) => {
      list.concat(componentProofList(component, allRows));
    });
    if (data.baseProject === 'MarketplaceProject') {
      list.concat(addShortestLongestRow(list));
    }
    listToProof = requireMinList(list);
  }
  return listToProof;
}

function saveToFile() {
  const ws = fs.createWriteStream(`./tmp/${FILE_NAME}${EXT}`);
  const csvData = [];
  csvData.push(Object.keys(listToProof[0]));
  csvData.push(...listToProof.map(row => row.values()));
  csv.write(csvData, { headers: true }).pipe(ws);
}

// Figure out how to write to CSV
function allRows() {

}

function addShortestLongestRow(existsList) {
  const requiredVariables = data.baseProject.sanitizedPlanVariables;
  const list = requiredVariables.eachWithObject(existsList, (variable, tempList) => {
    const keys = tempList.map(row => row[data.baseProject.primaryKey.toLowerCase()]).compact();
    const shortestRow = allRows.minBy(row => (keys.includes(row[data.baseProject.primaryKey]) ? Infinity : row[variable.toLowerCase()].toString().length));
    const longestRow = allRows.maxBy(row => (keys.includes(row[data.baseProject.primaryKey]) ? -1 : row[variable.toLowerCase()].toString().length));
    tempList.push(...[shortestRow, longestRow]);
  });
  return list;
}

function requireMinList(list) {
  if (list.size >= MIN_REQUIRED) { return list; }
  const keysOfList = list.map(obj => obj[data.baseProject.primaryKey.toLowerCase()]).compact();
  let n = 0;
  let row;
  while (list.count < MIN_REQUIRED) {
    row = allRows[n];
    if (!keysOfList.includes(row[data.baseProject.primaryKey.toLowerCase()])) {
      list.push(row);
    }
    n += 1;
  }
  return list;
}

function filterRequiredFields(csv, segment) {
  const requiredVariables = data.baseProject.xmpieRequiredFields;
}
