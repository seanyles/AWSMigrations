
// const fs = require('fs');
// const cpl = require('./component-proof-list-service');

// const FILE_NAME = 'proof_set_file';
// const EXT = '.csv';
// const MIN_REQUIRED = 10;

// let data;

// async function perform(event) {
//   try {
//     data = event;
//     console.log(`CreateProofSetJob - perform on segmentID ${data.segment.id}`);
//     await saveToFile();
//     console.log(`CreateProofSetJob - Proof set successfully created for segment ID,
// ${data.segment.id}`);
//   } catch (err) {
//     // Send an email?
//     console.error(`ERROR: CreateProofSetJob - CreateProofSetJob - ${err} ${err.stack},
// segment ID ${data.segment.id}`);
//   }
// }

// module.exports = perform;

// async function listToProof() {
//   const list = [];
//   await data.components.forEach((component) => {
//     list.concat(cpl(component, allRows));
//   });
//   if (data.baseProject === 'MarketplaceProject') {
//     await list.concat(addShortestLongestRow(list));
//   }
//   return requireMinList(list);
// }

// // Figure out how to write to CSV
// function saveToFile() {
//   const file = fs.open(`./tmp/${FILE_NAME}${EXT}`);
// }

// // Figure out how to write to CSV
// function allRows() {

// }

// function addShortestLongestRow(existsList) {

// }

// async function requireMinList(list) {
//   if (list.size >= MIN_REQUIRED) {
//     return list;
//   }
// }
