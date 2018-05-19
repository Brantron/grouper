const axios = require("axios");
const { execSync } = require("child_process");

const project = execSync("git config --get remote.origin.url")
  .toString()
  .trim();
const branch = execSync(
  "git ls-remote --heads origin | grep $(git rev-parse HEAD) | cut -d / -f 3"
)
  .toString()
  .trim();

async function sendData(path) {
  const files = await axios.get(path);
  return files;
}

const { SHARD_COUNT = 1, SHARD_INDEX = 0 } = process.env;

async function getFiles() {
  const params = `?project=${project}&branch=${branch}&total=${SHARD_COUNT}&index=${SHARD_INDEX}`;
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
