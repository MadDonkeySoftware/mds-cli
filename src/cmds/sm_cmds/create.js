const got = require('got');
const fs = require('fs');
const util = require('util');
const urlJoin = require('url-join');

const utils = require('../../../lib/utils');

const readFile = util.promisify(fs.readFile);

const createStateMachine = (file) => utils.getEnvConfig()
  .then((conf) => urlJoin(conf.smUrl, 'machine'))
  .then((url) => readFile(file)
    .then((body) => {
      const postOptions = {
        headers: {
          'Content-Type': 'application/json',
        },
        throwHttpErrors: false,
        body,
      };

      return got.post(url, postOptions);
    }));

const printResult = (resp) => {
  const { statusCode, body } = resp;
  if (statusCode === 200) {
    utils.display(`State machine created successfully. Id: ${JSON.parse(body).uuid}`);
  } else {
    utils.display('An error occurred while creating the state machine.');
    utils.display(`Status: ${statusCode}`);
  }
};

exports.command = 'create <file>';
exports.desc = 'Creates a new state machine';
exports.builder = {};
exports.handler = (argv) => createStateMachine(argv.file)
  .then((resp) => printResult(resp));