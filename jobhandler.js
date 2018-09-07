
module.exports.hello = async (event) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Go Serverless v1.0! Your function executed successfully!',
      input: event,
    }),
  };
  return response;
};

const createProofSet = require('src/create-proof-set');

module.exports.createProofSetJob = async event => createProofSetJob(event);
