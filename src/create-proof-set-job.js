
const fs = require('fs');
const csv = require('fast-csv');
const parse = require('csv-parse');
const transform = require('stream-transform');
const rubify = require('../ruby-magic').rubify;
const componentProofList = require('./component-proof-list-service');

const FILE_NAME = 'proof-set-file';
const EXT = '.csv';
const MIN_REQUIRED = 10;

let segment;

let primaryKey;
let downloadDocument;

async function perform(seg, stream) {
  try {
    segment = seg;
    downloadDocument = stream;
    primaryKey = segment.baseProject.primaryKey;
    console.log(`CreateProofSetJob - perform on segmentID ${segment.id}`);
    const allRows = await findRows();
    const listToProof = generateListToProof(allRows);
    await saveToFile(listToProof);
  } catch (err) {
    // Send an email
    console.error(`ERROR: CreateProofSetJob - ${err.stack}, segment ID ${segment.id}`);
    throw err;
  }
}

module.exports = perform;

function saveToFile(listToProof) {
  console.log(`CreatingProofSetJob - writing proof data to /tmp/${FILE_NAME}${EXT}`);
  const ws = fs.createWriteStream(`/tmp/${FILE_NAME}${EXT}`);
  const csvData = listToProof.map(row => rubify(row).values());
  csvData.unshift(Object.keys(listToProof[0]));
  csv.write(csvData, { headers: true }).pipe(ws);
  return new Promise((resolve, reject) => {
    ws.on('finish', () => resolve(console.log(`CreateProofSetJob - Proof set successfully created for segment ID, ${segment.id}`)));
    ws.on('error', err => reject(err));
  });
}

function findRows() {
  const allRows = [];
  console.log('CreateProofSetJob - Finding All Rows of Data');
  const requiredVariables = segment.baseProject.xmpieRequiredFields;
  const parser = parse({ columns: true, relax_column_count: true });
  const transformer = transform(record => sliceRequiredFields(record, requiredVariables));
  transformer.on('readable', () => {
    const row = transformer.read();
    if (row) {
      allRows.push(row);
    }
  });
  downloadDocument.pipe(parser).pipe(transformer);
  return new Promise((resolve, reject) => {
    transformer.on('finish', () => {
      console.log('CreateProofSetJob - all rows successfully found');
      resolve(allRows);
    });
    transformer.on('error', err => reject(err));
  });
}

function generateListToProof(allRows) {
  console.log('CreateProofSetJob - generating list to proof');
  const list = [];
  segment.components.forEach((component) => {
    list.push(...componentProofList(component, allRows));
  });
  if (segment.baseProject.type === 'MarketplaceProject') {
    addShortestLongestRow(list, allRows);
  }
  console.log('CreateProofSetJob - list to proof generated');
  return requireMinList(list, allRows);
}

function addShortestLongestRow(existsList, allRows) {
  const requiredVariables = rubify(segment.baseProject.sanitizedPlanVariables);
  requiredVariables.eachWithObject(existsList, (variable, tempList) => {
    const v = variable.toLowerCase();
    const tl = rubify(tempList);
    const keys = tl.mapR(row => row[primaryKey.toLowerCase()]).compact();
    const shortestRow = rubify(allRows).minBy(row => (
      keys.includes(row[primaryKey]) ? Infinity : rubify(row[v]).toString().length));
    const longestRow = rubify(allRows).maxBy(row => (
      keys.includes(row[primaryKey]) ? -1 : rubify(row[v]).toString().length));
    tl.merge([shortestRow, longestRow]);
  });
}

function requireMinList(list, allRows) {
  console.log('CreateProofSetJob - Requiring minimum of list');
  if (list.size >= MIN_REQUIRED) { return list; }
  const keysOfList = rubify(list).mapR(obj => obj[primaryKey.toLowerCase()]).compact();
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

function sliceRequiredFields(record, requiredFields) {
  const obj = {};
  Object.keys(record).forEach((key) => {
    if (requiredFields.includes(key.toUpperCase())) {
      obj[key.toLowerCase()] = record[key];
    }
  });
  return obj;
}
