// src/tests/flows/login.flow.spec.ts
import { expect, browser } from "@wdio/globals";
import { LoginPage } from "../../pages/login.page";
import { HomePage } from "../../pages/home.page";
import * as userData from "../../test-data/users.json";
import { TestHelpers } from "../../utils/test-helpers";

describe("Login Flow", () => {
  let loginPage: LoginPage;
  let homePage: HomePage;

  before(() => {
    loginPage = new LoginPage();
    homePage = new HomePage();
  });

  it("should complete login flow with validations", async () => {
    console.log(TestHelpers.formatTestLog("=== Test: Login Flow with Validations ==="));
    
    try {
      // Ensure app is stable
      await TestHelpers.waitForApp(3000);
      
      // Take initial screenshot
      await TestHelpers.takeScreenshot('before-login');
      
      // Perform login with proper credentials
      await loginPage.performLogin(
        userData.validUser.mobileNumber,
        userData.validUser.otp
      );
      
      // Wait for home page to load after navigation
      console.log("\nStep 7: Verifying user is on home page...");
      await TestHelpers.waitForApp(3000);
      
      // Take screenshot after login and navigation
      await TestHelpers.takeScreenshot('after-login-home');
      
      // Verify we're on home page by checking search bar
      const isHomePage = await homePage.isHomePageDisplayed();
      expect(isHomePage).toBe(true);
      
      console.log(TestHelpers.formatSuccessLog("Login completed successfully"));
      console.log(TestHelpers.formatSuccessLog("User successfully redirected to Home page"));
      console.log(TestHelpers.formatSuccessLog("Search bar is visible on Home page\n"));
      
    } catch (error) {
      console.error(TestHelpers.formatErrorLog(`Login test failed: ${error}`));
      await TestHelpers.takeScreenshot('login-error-final');
      throw error;
    }
  });
});