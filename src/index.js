const rootPathRegex = new RegExp(`^${process.cwd()}`);
const truncateFilePath = path => path.replace(rootPathRegex, ".");

export default class Grouper {
  constructor(globalConfig, options) {
    this._globalConfig = globalConfig;
    this._options = options;
    this.tests = [];
  }

  onRunComplete() {
    const results = this.reduceTestsToFileAndDurationObject();
    const sortable = this.specsToFilenameDurationArray(results);
    this.tests = this.sortedObjectFromArray(sortable);
    console.log(this.tests);
  }

  onTestResult(_, { testFilePath, testResults }) {
    testResults.map(({ duration }) => {
      this.tests.push({ duration, filePath: testFilePath });
    });
  }

  // reduce this.tests to an object. first remove
  // the unnecessary top level directories first
  // remove the unnecessary top level directories
  // from the file name, then set a key of the spec file
  // name with a value of the duration if not set, or
  // a sum of the old value with the new spec duration
  reduceTestsToFileAndDurationObject(specs) {
    return this.tests.reduce((acc, { filePath, duration }) => {
      const path = truncateFilePath(filePath);
      acc[path] = !!acc[path] ? acc[path] + duration : duration;
      return acc;
    }, {});
  }

  // given an object like {
  //  'filename.js': 123,
  //  'other.js': 321
  // }
  // returns an array like [['filename.js', 123] ['other.js', 321]]
  // this is for faster sorting
  specsToFilenameDurationArray(specs) {
    const sortable = [];
    for (var time in specs) {
      sortable.push([time, specs[time]]);
    }
    return sortable;
  }

  // given an array like [['filename.js', 123] ['other.js', 321]]
  // returns an object like {
  //   'other.js': 321,
  //   'filename.js': 123,
  // }

  sortedObjectFromArray(arr) {
    arr.sort((a, b) => b[1] - a[1]);

    return arr.reduce((acc, test) => {
      acc[test[0]] = test[1];
      return acc;
    }, {});
  }
}
