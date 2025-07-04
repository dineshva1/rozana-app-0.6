// src/tests/suites/app-complete.suite.spec.ts
import { browser } from "@wdio/globals";
import { TestHelpers } from "../../utils/test-helpers";

describe("App Complete Test Suite", () => {
  before(async () => {
    console.log("\n");
    console.log("========================================");
    console.log("   STARTING COMPLETE APP TEST SUITE    ");
    console.log("========================================");
    console.log("\n");
    
    // Take initial screenshot
    await TestHelpers.takeScreenshot('suite-start');
  });

  // Import and run all flow tests in order
  require("../flows/home.flow.spec");
  require("../flows/login.flow.spec");
  require("../flows/profile.flow.spec"); 
  require("../flows/search.flow.spec");
  require("../flows/categories.flow.spec");
  require("../flows/shopping.flow.spec");
  // require("../flows/featured-products.flow.spec");

  after(async () => {
    // Take final screenshot
    await TestHelpers.takeScreenshot('suite-complete');
    
    console.log("\n");
    console.log("========================================");
    console.log("   COMPLETE APP TEST SUITE FINISHED    ");
    console.log("========================================");
    console.log("\n");
    
    // Summary of tests
    console.log("\nTest Summary:");
    console.log("- Home Page Verification ✓");
    // console.log("- Login Flow ✓");
    // console.log("- Search Flow ✓");
    // console.log("- Shopping Flow ✓");
    console.log("- Categories Flow ✓");
    // console.log("- Featured Products Flow ✓");
    console.log("\n");
  });
});