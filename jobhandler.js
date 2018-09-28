
const AWS = require('aws-sdk');
const fs = require('fs');
const createProofSetJob = require('./src/create-proof-set-job');

const s3 = new AWS.S3();

module.exports.createProofSetJob = async (event) => {
  const srcBucket = event.Records[0].s3.bucket.name;
  const srcKey = event.Records[0].s3.object.key;

  try {
    const obj = await s3.getObject({
      Bucket: srcBucket,
      Key: srcKey,
    });
    const segment = obj.Metadata['x-amz-segment'];
    await createProofSetJob(segment, obj.createReadStream());
    const answer = {
      Bucket: srcBucket,
      Key: 'download/proof-set-file.csv',
      Body: Buffer.from(fs.readFile('/tmp/proof-set-file.csv', 'utf8')),
    };
    s3.putObject(answer);
  } catch (error) {
    console.error(error, error.stack);
    return error;
  }
};

module.exports.createProofSetJobAPI = async (event) => {
  console.log('Received event:', JSON.stringify(event, null, 2));
  try {
    const obj = await s3.getObject({
      Bucket: 'kleermail-jobs',
      Key: event.doc_key,
    });
    await createProofSetJob(event, obj.createReadStream());
    const answer = {
      Bucket: 'kleermail-jobs',
      Key: 'proof-set-file.csv',
      Body: fs.createReadStream('/tmp/proof-set-file.csv', 'utf8'),
      // Body: Buffer.from('/tmp/proof-set-file.csv', 'utf8'),
    };
    await s3.putObject(answer);
    console.log('CreateProofsetJob - Job finished!');
  } catch (error) {
    console.error(error, error.stack);
    return error;
  }
};
