// src/tests/flows/profile.flow.spec.ts
import { expect, browser } from "@wdio/globals";
import { ProfilePage } from "../../pages/profile.page";
import { OrdersPage } from "../../pages/orders.page";
import { HomePage } from "../../pages/home.page";
import { TestHelpers } from "../../utils/test-helpers";

describe("Profile Flow", () => {
  let profilePage: ProfilePage;
  let ordersPage: OrdersPage;
  let homePage: HomePage;

  before(() => {
    profilePage = new ProfilePage();
    ordersPage = new OrdersPage();
    homePage = new HomePage();
  });

  it("should complete profile navigation and settings flow", async () => {
    console.log(TestHelpers.formatTestLog("=== Test: Profile Flow with Orders and Language Change ==="));
    
    try {
      // Step 1: Navigate to Profile
      console.log("\nStep 1: Navigating to Profile tab...");
      await TestHelpers.waitForApp(2000);
      const navigatedToProfile = await profilePage.navigateToProfile();
      expect(navigatedToProfile).toBe(true);
      
      // Verify profile page is displayed
      const isProfileDisplayed = await profilePage.isProfilePageDisplayed();
      expect(isProfileDisplayed).toBe(true);
      console.log(TestHelpers.formatSuccessLog("Profile page displayed"));
      await TestHelpers.takeScreenshot('profile-page');
      
      // Step 2: Access Your Orders
      console.log("\nStep 2: Accessing Your Orders...");
      await profilePage.clickYourOrders();
      await TestHelpers.waitForApp(2000);
      await TestHelpers.takeScreenshot('orders-page');
      
      // Step 3: Navigate through all order tabs
      console.log("\nStep 3: Navigating through order tabs...");
      await ordersPage.navigateThroughAllTabs();
      console.log(TestHelpers.formatSuccessLog("Completed navigation through all order tabs"));
      
      // Step 4: Go back to Profile
      console.log("\nStep 4: Going back to Profile page...");
      await ordersPage.goBack();
      await TestHelpers.waitForApp(2000);
      
      // Step 5: Language change flow
      console.log("\nStep 5: Language change flow...");
      
      // Scroll to find language option
      const foundLanguage = await profilePage.scrollToLanguageOption();
      expect(foundLanguage).toBe(true);
      await TestHelpers.takeScreenshot('language-option-visible');
      
      // Change to Hindi
      console.log("\n--- Changing language to Hindi ---");
      await profilePage.changeLanguage('Hindi');
      console.log(TestHelpers.formatSuccessLog("Language changed to Hindi"));
      
      // Wait for UI to stabilize
      await browser.pause(2000);
      
      // Scroll to ensure language option is visible again
      await profilePage.scrollToTop();
      await browser.pause(1000);
      await profilePage.scrollToLanguageOption();
      
      // Change back to English
      console.log("\n--- Changing language back to English ---");
      await profilePage.changeLanguage('English');
      console.log(TestHelpers.formatSuccessLog("Language changed back to English"));
      
      // Step 6: Navigate back to Home
      console.log("\nStep 6: Navigating back to Home...");
      const navigatedToHome = await profilePage.navigateToHome();
      expect(navigatedToHome).toBe(true);
      
      // Verify we're on home page
      await TestHelpers.waitForApp(2000);
      const isHomePage = await homePage.isHomePageDisplayed();
      expect(isHomePage).toBe(true);
      
      console.log(TestHelpers.formatSuccessLog("Profile flow completed successfully"));
      console.log(TestHelpers.formatSuccessLog("User successfully returned to Home page\n"));
      await TestHelpers.takeScreenshot('profile-flow-complete');
      
    } catch (error) {
      console.error(TestHelpers.formatErrorLog(`Profile flow test failed: ${error}`));
      await TestHelpers.takeScreenshot('profile-flow-error');
      throw error;
    }
  });
});