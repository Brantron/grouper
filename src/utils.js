const axios = require("axios");
const execSync = require("child_process").execSync;

const rootPathRegex = new RegExp(`^${process.cwd()}`);

const truncateFilePath = path => path.replace(rootPathRegex, ".");

const GROUPER_PATH = "https://grouper-app.herokuapp.com/test_runs";

const bashCommandToParam = string =>
  execSync(string)
    .toString()
    .trim();

const sha = bashCommandToParam("git rev-parse HEAD");

const project = bashCommandToParam("git config --get remote.origin.url");

const branch = bashCommandToParam(
  "git ls-remote --heads origin | grep $(git rev-parse HEAD) | cut -d / -f 3"
);

const createData = test_files_attributes => ({
  test_run: {
    sha,
    branch,
    project,
    test_files_attributes
  }
});

async function sendData(data) {
  const requestData = createData(data);
  return axios
    .post(GROUPER_PATH, requestData)
    .then(response => console.log(response))
    .catch(e => console.log(e));
}
module.exports = {
  rootPathRegex,
  truncateFilePath,
  sendData,
  sha,
  project,
  branch
};
