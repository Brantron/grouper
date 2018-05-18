const axios = require("axios");
const execSync = require("child_process").execSync;

const rootPathRegex = new RegExp(`^${process.cwd()}`);

const truncateFilePath = path => path.replace(rootPathRegex, ".");

const GROUPER_PATH = "https://grouper-app.herokuapp.com/test_runs";

const project = execSync("git config --get remote.origin.url")
  .toString()
  .trim();
const branch = execSync(
  "git ls-remote --heads origin | grep $(git rev-parse HEAD) | cut -d / -f 3"
)
  .toString()
  .trim();

const createData = test_files_attributes => ({
  test_run: {
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
module.exports = { rootPathRegex, truncateFilePath, sendData };
