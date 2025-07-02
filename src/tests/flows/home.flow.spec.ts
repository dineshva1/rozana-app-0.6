// src/tests/flows/home.flow.spec.ts
import { expect, browser } from "@wdio/globals";
import { HomePage } from "../../pages/home.page";
import { TestHelpers } from "../../utils/test-helpers";

describe("Home Page Flow", () => {
  let homePage: HomePage;

  before(() => {
    homePage = new HomePage();
  });

  it("should launch the app successfully and verify home page", async () => {
    console.log(TestHelpers.formatTestLog("=== Test: App Launch and Home Page Verification ==="));
    
    // Wait for app to fully load
    await TestHelpers.waitForApp(7000);
    
    // Take screenshot
    await TestHelpers.takeScreenshot('app-launch');
    
    // Check if search bar is visible (primary indicator of home page)
    const searchBarVisible = await homePage.isHomePageDisplayed();
    
    if (!searchBarVisible) {
      console.log("Search bar not immediately visible, waiting more...");
      await TestHelpers.waitForApp(3000);
    }
    
    // Final check
    const isHomePage = await homePage.isHomePageDisplayed();
    expect(isHomePage).toBe(true);
    
    console.log(TestHelpers.formatSuccessLog("App launched successfully"));
    console.log(TestHelpers.formatSuccessLog("Home page verified (search bar is visible)\n"));
  });
});