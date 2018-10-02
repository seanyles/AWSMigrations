
const AWS = require('aws-sdk');
const fs = require('fs');
const createProofSetJob = require('./src/create-proof-set-job');

const s3 = new AWS.S3();

module.exports.createProofSetJob = async (event) => {
  console.log('Received event:', JSON.stringify(event, null, 2));
  try {
    const obj = await s3.getObject({
      Bucket: 'kleermail-jobs',
      Key: event.doc_key,
    });
    await createProofSetJob(event, obj.createReadStream());
    await s3.upload({
      Bucket: 'kleermail-jobs',
      Key: 'download/proof-set-file.csv',
      Body: fs.createReadStream('/tmp/proof-set-file.csv', 'utf8'),
    }).promise();
    // return presigned url of the application
  } catch (error) {
    console.error(error, error.stack);
    return error;
  }
};
