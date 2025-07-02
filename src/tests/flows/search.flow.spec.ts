// src/tests/flows/search.flow.spec.ts
import { expect, browser } from "@wdio/globals";
import { HomePage } from "../../pages/home.page";
import { SearchPage } from "../../pages/search.page";
import { TestHelpers } from "../../utils/test-helpers";

describe("Search Flow", () => {
  let homePage: HomePage;
  let searchPage: SearchPage;

  before(() => {
    homePage = new HomePage();
    searchPage = new SearchPage();
  });

  it("should search for products and add them to cart", async () => {
    console.log(TestHelpers.formatTestLog("=== Test: Search Products Flow ==="));
    
    try {
      // Step 1: Ensure we're on home page
      console.log("\nStep 1: Verifying we're on home page...");
      await TestHelpers.waitForApp(3000);
      
      const isHomePage = await homePage.isHomePageDisplayed();
      expect(isHomePage).toBe(true);
      console.log("✓ Home page confirmed");
      
      await TestHelpers.takeScreenshot('search-00-home-page');
      
      // Step 2: Search and add products
      console.log("\nStep 2: Searching and adding products...");
      const productsAdded = await searchPage.searchAndAddProducts();
      
      // Verify we added at least some products
      expect(productsAdded).toBeGreaterThan(0);
      console.log(`✓ Added ${productsAdded} products via search`);
      
      // Step 3: Verify we're back on home page
      console.log("\nStep 3: Verifying return to home page...");
      await TestHelpers.waitForApp(2000);
      
      const isBackHome = await homePage.isHomePageDisplayed();
      expect(isBackHome).toBe(true);
      console.log("✓ Successfully returned to home page");
      
      await TestHelpers.takeScreenshot('search-05-back-to-home');
      
      console.log(TestHelpers.formatSuccessLog(`Search flow completed successfully! Added ${productsAdded} products`));
      
      // Extra pause to ensure stability before next test
      await TestHelpers.waitForApp(2000);
      
    } catch (error) {
      console.error(TestHelpers.formatErrorLog(`Search flow failed: ${error}`));
      await TestHelpers.takeScreenshot('search-error-final');
      
      // Try to recover by navigating to home
      try {
        console.log("Attempting to recover and navigate to home...");
        await browser.back();
        await TestHelpers.waitForApp(2000);
      } catch (recoveryError) {
        console.log("Recovery failed:", recoveryError);
      }
      
      throw error;
    }
  });
});