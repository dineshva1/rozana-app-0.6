// src/tests/flows/categories.flow.spec.ts
import { expect, browser } from "@wdio/globals";
import { HomePage } from "../../pages/home.page";
import { CategoriesPage } from "../../pages/categories.page";
import { TestHelpers } from "../../utils/test-helpers";

describe("Categories Flow", () => {
  let homePage: HomePage;
  let categoriesPage: CategoriesPage;

  before(() => {
    homePage = new HomePage();
    categoriesPage = new CategoriesPage();
  });

  it("should add products from multiple categories", async () => {
    console.log(TestHelpers.formatTestLog("=== Test: Categories Shopping Flow ==="));
    
    try {
      // Step 1: Ensure we're on home page
      console.log("\nStep 1: Starting from home page...");
      await TestHelpers.waitForApp(3000);
      
      const isHomePage = await homePage.isHomePageDisplayed();
      expect(isHomePage).toBe(true);
      console.log("✓ Home page confirmed");
      
      // Step 2: Add products from categories
      console.log("\nStep 2: Adding products from multiple categories...");
      const categoriesProductCount = await categoriesPage.addProductsFromMultipleCategories();
      
      expect(categoriesProductCount).toBeGreaterThan(0);
      console.log(`✓ Added ${categoriesProductCount} products from categories`);
      
      // Step 2.5: Navigate back to home page after adding category products
      console.log("\nStep 2.5: Navigating back to home page...");
      await TestHelpers.waitForApp(2000);
      
      // First try to go back from category page
      const wentBack = await categoriesPage.goBack();
      if (wentBack) {
        console.log("✓ Navigated back from categories page");
        await TestHelpers.waitForApp(2000);
      }
      
      // Ensure we're on home page by clicking home tab
      const wentHome = await categoriesPage.navigateToHome();
      if (wentHome) {
        console.log("✓ Home tab clicked");
      }
      
      // Verify we're back on home page
      await TestHelpers.waitForApp(1500);
      let isBackHome = await homePage.isHomePageDisplayed();
      
      // If still not on home page, try one more time
      if (!isBackHome) {
        console.log("Not on home page yet, trying once more...");
        await categoriesPage.navigateToHome();
        await TestHelpers.waitForApp(2000);
        isBackHome = await homePage.isHomePageDisplayed();
      }
      
      expect(isBackHome).toBe(true);
      console.log("✓ Successfully returned to home page");
      
      await TestHelpers.takeScreenshot('categories-back-to-home');
      
      console.log(TestHelpers.formatSuccessLog("Categories shopping flow completed - ready for test case 5!"));
      
      // Add extra pause to ensure stability before next test
      await TestHelpers.waitForApp(2000);
      
    } catch (error) {
      console.error(TestHelpers.formatErrorLog(`Categories flow failed: ${error}`));
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