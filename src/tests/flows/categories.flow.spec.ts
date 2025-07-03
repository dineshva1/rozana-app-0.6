// src/tests/flows/categories.flow.spec.ts
import { expect, browser } from "@wdio/globals";
import { HomePage } from "../../pages/home.page";
import { CategoriesPage } from "../../pages/categories.page";
import { TestHelpers } from "../../utils/test-helpers";

describe("Categories Section Test", () => {
  let homePage: HomePage;
  let categoriesPage: CategoriesPage;

  before(() => {
    homePage = new HomePage();
    categoriesPage = new CategoriesPage();
  });

  it("should test complete categories functionality", async () => {
    console.log(TestHelpers.formatTestLog("=== Test: Categories Shopping Flow ==="));
    
    try {
      // Step 1: Ensure we're on home page
      console.log("\nStep 1: Starting from home page...");
      await TestHelpers.waitForApp(3000);
      
      const isHomePage = await homePage.isHomePageDisplayed();
      expect(isHomePage).toBe(true);
      console.log("✓ Home page confirmed");
      
      // Step 2: Test categories flow
      console.log("\nStep 2: Testing categories section...");
      const categoriesProductCount = await categoriesPage.testCategoriesFlow();
      
      expect(categoriesProductCount).toBeGreaterThan(0);
      console.log(`✓ Successfully added ${categoriesProductCount} products from categories`);
      
      // Step 3: Verify we're back on home page
      console.log("\nStep 3: Verifying return to home page...");
      await TestHelpers.waitForApp(2000);
      
      const isBackHome = await homePage.isHomePageDisplayed();
      expect(isBackHome).toBe(true);
      console.log("✓ Successfully returned to home page");
      
      await TestHelpers.takeScreenshot('categories-test-complete');
      
      console.log(TestHelpers.formatSuccessLog("Categories section test completed successfully!"));
      
      // Add extra pause to ensure stability
      await TestHelpers.waitForApp(2000);
      
    } catch (error) {
      console.error(TestHelpers.formatErrorLog(`Categories test failed: ${error}`));
      await TestHelpers.takeScreenshot('categories-error-final');
      
      // Try to recover by navigating to home
      try {
        console.log("Attempting to recover and navigate to home...");
        await categoriesPage.navigateToHome();
        await TestHelpers.waitForApp(2000);
      } catch (recoveryError) {
        console.log("Recovery failed:", recoveryError);
      }
      
      throw error;
    }
  });
});