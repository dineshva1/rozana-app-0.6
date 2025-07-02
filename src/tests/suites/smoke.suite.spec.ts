// src/tests/suites/smoke.suite.spec.ts
import { browser } from "@wdio/globals";
import { TestHelpers } from "../../utils/test-helpers";

describe("Smoke Test Suite", () => {
  before(async () => {
    console.log("\n");
    console.log("====================================");
    console.log("      STARTING SMOKE TEST SUITE     ");
    console.log("====================================");
    console.log("\n");
    
    await TestHelpers.takeScreenshot('smoke-suite-start');
  });

  // Only run critical tests for smoke testing
  require("../flows/home.flow.spec");
  require("../flows/login.flow.spec");

  after(async () => {
    await TestHelpers.takeScreenshot('smoke-suite-complete');
    
    console.log("\n");
    console.log("====================================");
    console.log("     SMOKE TEST SUITE FINISHED      ");
    console.log("====================================");
    console.log("\n");
  });
});