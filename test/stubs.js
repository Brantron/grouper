import faker from "faker";

const genDuration = () => faker.random.number();
const genFilePath = () => faker.system.fileName();
const arr = length => Array.apply(null, { length }).map(Number.call, Number);

const generateTestResults = length => ({
  duration: genDuration()
});

const generateThisDotTests = () => ({
  duration: genDuration(),
  filePath: genFilePath()
});

const tests = length => arr(length).map(generateThisDotTests);

const testResult = {
  testFilePath: faker.system.fileName(),
  testResults: arr(30).map(generateTestResults)
};

export { tests, testResult };
