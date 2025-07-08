// src/tests/flows/address-crud.spec.ts
import { expect, browser } from "@wdio/globals";
import { HomePage } from "../../pages/home.page";
import { LoginPage } from "../../pages/login.page";
import { AddressPage } from "../../pages/address.page";
import { TestHelpers } from "../../utils/test-helpers";
import * as userData from "../../test-data/users.json";

describe("Address CRUD Operations with Map Drag", () => {
  let homePage: HomePage;
  let loginPage: LoginPage;
  let addressPage: AddressPage;

  before(() => {
    homePage = new HomePage();
    loginPage = new LoginPage();
    addressPage = new AddressPage();
  });

  it("should perform complete CRUD operations with map drag functionality", async () => {
    console.log(TestHelpers.formatTestLog("=== Test: Complete Address CRUD with Map Drag ==="));
    
    try {
      // ========== PHASE 1: INITIAL SETUP & LOGIN ==========
      console.log("\n========== PHASE 1: Initial Setup & Login ==========");
      
      // Wait for app to load
      await TestHelpers.waitForApp(3000);
      const isHomePage = await homePage.isHomePageDisplayed();
      expect(isHomePage).toBe(true);
      console.log("✓ App launched successfully");
      
      // Navigate to location/address section
      await addressPage.clickLocationOnHomePage();
      await TestHelpers.waitForApp(3000);
      console.log("✓ Clicked on location button");
      
      // Handle login
      await loginPage.cancelMobileNumberPrompt();
      console.log("✓ Cancelled any existing prompt");
      
      await loginPage.enterMobileNumber(userData.validUser.mobileNumber);
      console.log(`✓ Entered mobile number: ${userData.validUser.mobileNumber}`);
      
      await loginPage.clickSendOTP();
      console.log("✓ OTP requested");
      
      await loginPage.enterOTP(userData.validUser.otp);
      console.log("✓ OTP entered and verified");
      
      // Wait for My Addresses page
      await browser.pause(3000);
      const addressPageLoaded = await addressPage.waitForMyAddressesPage();
      expect(addressPageLoaded).toBe(true);
      console.log("✓ Successfully navigated to My Addresses page");
      
      // ========== PHASE 2: PERFORM COMPLETE CRUD WITH MAP DRAG ==========
      console.log("\n========== PHASE 2: Complete CRUD Operations ==========");
      
      // Use the new complete CRUD method
      const crudSuccess = await addressPage.performCompleteAddressCRUDWithMapDrag();
      expect(crudSuccess).toBe(true);
      
      // ========== PHASE 3: RETURN TO HOME ==========
      console.log("\n========== PHASE 3: Return to Home ==========");
      
      await addressPage.goBackToHome();
      console.log("✓ Returned to home page");
      
      // ========== TEST SUMMARY ==========
      console.log(TestHelpers.formatSuccessLog("\n✅ Address CRUD Test Completed Successfully!"));
      console.log("\n📊 Test Summary:");
      console.log("   1. ✓ Created initial test address (HOME)");
      console.log("   2. ✓ Edited address using map drag");
      console.log("   3. ✓ Verified address auto-updated after drag");
      console.log("   4. ✓ Deleted the edited address");
      console.log("   5. ✓ Created 3 new addresses (HOME, WORK, OTHER)");
      console.log("   6. ✓ Returned to home page");
      console.log("\n📍 Final State: 3 saved addresses");
      
    } catch (error) {
      console.error(TestHelpers.formatErrorLog(`\n❌ Test failed: ${error}`));
      await TestHelpers.takeScreenshot('test-error-final');
      
      // Try to recover and go back to home
      try {
        const backBtn = await browser.$('//android.widget.Button[@content-desc="Back"]');
        if (await backBtn.isExisting()) {
          await backBtn.click();
        }
      } catch (e) {
        // Ignore recovery errors
      }
      
      throw error;
    }
  });
});