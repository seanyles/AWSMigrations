
const createProofSetJob = require('./src/create-proof-set-job');
const AWS = require('aws-sdk');

const s3 = new AWS.S3();

module.exports.createProofSetJob = async (event) => {
  const srcBucket = event.Records[0].s3.bucket.name;
  const srcKey = event.Records[0].s3.object.key;

  // Retrieve the object
  try {
    const obj = await s3.getObject({
      Bucket: srcBucket,
      Key: srcKey,
    });
    await createProofSetJob(obj);
  } catch (error) {
    console.error(error, error.stack());
    return error;
  }
};
