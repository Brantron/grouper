import Grouper from "../src/index";
import { tests, testResult } from "./stubs";

const isLesserThanNext = (value, index, arr) => {
  const next = arr[index + 1];
  return next && value < next;
};

describe("Grouper", () => {
  let reporter;

  beforeEach(() => {
    reporter = new Grouper();
  });

  it("should implement onRunComplete ", () => {
    expect(reporter.onRunComplete).toBeDefined();
  });

  it("should implement onTestResult ", () => {
    expect(reporter.onTestResult).toBeDefined();
  });

  describe("onRunComplete", () => {
    const COUNT = 100;
    let specs;

    beforeEach(() => {
      Object.defineProperty(reporter, "tests", { value: tests(COUNT) });
      reporter.onRunComplete();
    });

    it("has all specs", () => {
      specs = Object.values(reporter.tests);
      expect(specs.length).toBe(COUNT);
    });

    it("returns tests in the correct order", () => {
      specs = Object.values(reporter.tests);
      expect(specs.some(isLesserThanNext)).toBe(false);
    });
  });

  describe("onTestResult", () => {
    let firstSpec;
    beforeEach(() => {
      reporter.onTestResult({}, testResult);
      firstSpec = reporter.tests[0];
    });

    it("pushes all objects", () => {
      expect(reporter.tests.length).toBe(testResult.testResults.length);
    });

    it("pushes an object with the correct duration", () => {
      const firstResult = testResult.testResults[0];
      expect(firstSpec.duration).toBe(firstResult.duration);
    });

    it("pushes an object with the correct testFilePath", () => {
      const { testFilePath } = testResult;
      expect(firstSpec.filePath).toBe(testFilePath);
    });
  });

  describe("specsToFilenameDurationArray", () => {
    let result;
    const stub = {
      "filename.js": 123,
      "other.js": 321,
      "file.js": 555,
      "stuff.js": 444
    };

    beforeEach(() => {
      result = reporter.specsToFilenameDurationArray(stub);
    });

    it("has all specs", () => {
      expect(result.length).toBe(Object.keys(stub).length);
    });

    it("pushes filename to array", () => {
      expect(result[0][0]).toBe(Object.keys(stub)[0]);
    });

    it("pushes duration to array", () => {
      expect(result[0][1]).toBe(Object.values(stub)[0]);
    });
  });
});
