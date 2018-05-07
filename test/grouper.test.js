import Grouper from "../src/index";
import { tests, testResult } from "./stubs";

const isGreaterOrEqual = (value, index, arr) => {
  const next = arr[index + 1];
  return !next || value >= next;
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
      expect(specs.some(isGreaterOrEqual)).toBe(true);
    });
  });

  describe("onTestResult", () => {
    it("pushes all objects", () => {
      reporter.onTestResult({}, testResult);
      expect(reporter.tests.length).toBe(testResult.testResults.length);
    });

    it("pushes an object with the correct duration", () => {
      const firstResult = testResult.testResults[0];
      reporter.onTestResult({}, testResult);
      expect(reporter.tests[0].duration).toBe(firstResult.duration);
    });

    it("pushes an object with the correct testFilePath", () => {
      const { testFilePath } = testResult;
      reporter.onTestResult({}, testResult);
      expect(reporter.tests[0].filePath).toBe(testFilePath);
    });
  });
});
