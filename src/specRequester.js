const axios = require("axios");
const { execSync } = require("child_process");
const utils = require("./utils");
const { sha, project, branch } = utils;

async function sendData(path) {
  const files = await axios.get(path);
  return files;
}

const { SHARD_COUNT = 1, SHARD_INDEX = 0 } = process.env;

async function getFiles() {
  const params = `?sha=${sha}&project=${project}&branch=${branch}&total=${SHARD_COUNT}&index=${SHARD_INDEX}`;
  const GROUPER_PATH = `https://grouper-app.herokuapp.com/get_run${encodeURI(
    params
  )}`;
  return sendData(GROUPER_PATH);
}

getFiles().then(({ data }) => {
  process.stdout.write(
    data.files
      .map(str => "**/" + str.substring(2))
      .join("|")
      .toString()
  );
});
