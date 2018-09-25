
const AWS = require('aws-sdk');
const fs = require('fs');
const createProofSetJob = require('./src/create-proof-set-job');

const s3 = new AWS.S3();

module.exports.createProofSetJob = async (event) => {
  const srcBucket = event.Records[0].s3.bucket.name;
  const srcKey = event.Records[0].s3.object.key;
  const segment = event.Records[0].responseElements['x-amz-segment'];

  try {
    const obj = await s3.getObject({
      Bucket: srcBucket,
      Key: srcKey,
    });
    await createProofSetJob(segment, obj.createReadStream());
    const answer = {
      Bucket: srcBucket,
      Key: 'proof-set-file.csv',
      Body: fs.createReadStream('./tmp/proof-set-file.csv', 'utf8'),
    };
    s3.putObject(answer);
  } catch (error) {
    console.error(error, error.stack());
    return error;
  }
};
