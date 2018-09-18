
const fs = require('fs');
const csv = require('fast-csv');
const parse = require('csv-parse');
const transform = require('stream-transform');
const componentProofList = require('./component-proof-list-service');

const FILE_NAME = 'proof_set_file';
const EXT = '.csv';
const MIN_REQUIRED = 10;

let data;

let listToProof;
let primaryKey;
let downloadDocument;
const allRows = [];

async function perform(metadata, stream) {
  try {
    data = metadata;
    downloadDocument = stream;
    primaryKey = data.primaryKey;
    console.log(`CreateProofSetJob - perform on segmentID ${data.segment.id}`);
    await findAllRows();
    await generateListToProof();
    await saveToFile();
    console.log(`CreateProofSetJob - Proof set successfully created for segment ID, ${data.segment.id}`);
  } catch (err) {
    // Send an email?
    console.error(`ERROR: CreateProofSetJob - CreateProofSetJob - ${err} ${err.stack}, segment ID ${data.segment.id}`);
  }
}

module.exports = perform;

function generateListToProof() {
  if (listToProof) { return; }
  const list = [];
  data.components.forEach((component) => {
    list.concat(componentProofList(component, allRows));
  });
  if (data.baseProject.type === 'MarketplaceProject') {
    list.concat(addShortestLongestRow(list));
  }
  listToProof = requireMinList(list);
}

function saveToFile() {
  const ws = fs.createWriteStream(`./tmp/${FILE_NAME}${EXT}`);
  const csvData = listToProof.map(row => row.values());
  csvData.unshift(Object.keys(listToProof[0]));
  csv.write(csvData, { headers: true }).pipe(ws);
}

// Figure out how to write to CSV
function findAllRows() {
  if (allRows) { return; }
  const requiredVariables = data.baseProject.XmpieRequiredFields;
  const parser = parse({ columns: true });
  const transformer = transform(record => record.slice(requiredVariables));
  transformer.on('readable', () => {
    const row = transformer.read();
    if (row) {
      allRows.push(row);
    }
  });
  transformer.on('error', err => console.error(`failed to calculate allRows: ${err.message}`));
  transformer.on('finish', () => console.log('allRows calculated'));
  downloadDocument.pipe(parser).pipe(transformer);
}

function addShortestLongestRow(existsList) {
  const requiredVariables = data.baseProject.sanitizedPlanVariables;
  const list = requiredVariables.eachWithObject(existsList, (variable, tempList) => {
    const v = variable.toLowerCase();
    const keys = tempList.map(row => row[primaryKey.toLowerCase()]).compact();
    const shortestRow = allRows.minBy(row => (
      keys.includes(row[primaryKey]) ? Infinity : row[v].toString().length));
    const longestRow = allRows.maxBy(row => (
      keys.includes(row[primaryKey]) ? -1 : row[v].toString().length));
    tempList.push(...[shortestRow, longestRow]);
  });
  return list;
}

function requireMinList(list) {
  if (list.size >= MIN_REQUIRED) { return list; }
  const keysOfList = list.map(obj => obj[primaryKey.toLowerCase()]).compact();
  let n = 0;
  let row;
  while (list.count < MIN_REQUIRED) {
    row = allRows[n];
    if (!keysOfList.includes(row[primaryKey.toLowerCase()])) {
      list.push(row);
    }
    n += 1;
  }
  return list;
}
