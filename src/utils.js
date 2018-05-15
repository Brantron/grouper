import axios from "axios";
import { execSync } from "child_process";

const rootPathRegex = new RegExp(`^${process.cwd()}`);

const truncateFilePath = path => path.replace(rootPathRegex, ".");

const GROUPER_PATH = "https://grouper-app.herokuapp.com/test_runs";

const project = execSync(
  "basename -s .git `git config --get remote.origin.url`"
)
  .toString()
  .trim();
const branch = execSync("git branch | xargs")
  .toString()
  .trim()
  .substring(2);

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

export { rootPathRegex, truncateFilePath, sendData };
