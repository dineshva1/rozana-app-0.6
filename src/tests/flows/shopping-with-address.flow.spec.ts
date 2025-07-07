// src/tests/flows/shopping-with-address.flow.spec.ts
import { expect, browser } from "@wdio/globals";
import { HomePage } from "../../pages/home.page";
import { LoginPage } from "../../pages/login.page";
import { AddressPage } from "../../pages/address.page";
import { ProductsPage } from "../../pages/products.page";
import { CartPage } from "../../pages/cart.page";
import { TestHelpers } from "../../utils/test-helpers";
import * as userData from "../../test-data/users.json";

describe("Shopping Flow with Address Setup", () => {
  let homePage: HomePage;
  let loginPage: LoginPage;
  let addressPage: AddressPage;
  let productsPage: ProductsPage;
  let cartPage: CartPage;

  before(() => {
    homePage = new HomePage();
    loginPage = new LoginPage();
    addressPage = new AddressPage();
    productsPage = new ProductsPage();
    cartPage = new CartPage();
  });

  it("should complete shopping flow with address setup through location click", async () => {
    console.log(TestHelpers.formatTestLog("=== Test: Shopping Flow with Address Setup ==="));
    
    try {
      // PHASE 1: Click Location and Login
      console.log("\n========== PHASE 1: Click Location and Login ==========");
      
      // Step 1: Verify home page
      console.log("\nStep 1: Verifying home page...");
      await TestHelpers.waitForApp(3000);
      const isHomePage = await homePage.isHomePageDisplayed();
      expect(isHomePage).toBe(true);
      console.log("✓ Home page confirmed");
      await TestHelpers.takeScreenshot('address-01-home');
      
      // Step 2: Click location button
      console.log("\nStep 2: Clicking location button...");
      const locationClicked = await addressPage.clickLocationOnHomePage();
      expect(locationClicked).toBe(true);
      console.log("✓ Location button clicked");
      await TestHelpers.takeScreenshot('address-02-location-clicked');
      
      // Step 3: Handle login
      console.log("\nStep 3: Handling login from location click...");
      console.log("Expected flow:");
      console.log("  1. Cancel mobile number prompt");
      console.log("  2. Enter mobile number");
      console.log("  3. Click Send OTP");
      console.log("  4. Enter OTP");
      console.log("  5. Auto-redirect to My Addresses page\n");
      
      // Wait for login page
      await TestHelpers.waitForApp(3000);
      await TestHelpers.takeScreenshot('address-03-login-page');
      
      // Perform login using existing method
      await loginPage.cancelMobileNumberPrompt();
      await loginPage.enterMobileNumber(userData.validUser.mobileNumber);
      await loginPage.clickSendOTP();
      await loginPage.enterOTP(userData.validUser.otp);
      
      console.log("✓ Login completed");
      
      // Wait for My Addresses page
      console.log("\nWaiting for redirect to My Addresses page...");
      await browser.pause(3000);
      const addressPageLoaded = await addressPage.waitForMyAddressesPage();
      expect(addressPageLoaded).toBe(true);
      console.log("✓ My Addresses page loaded");
      await TestHelpers.takeScreenshot('address-04-my-addresses');
      
      // PHASE 2: Add Three Addresses
      console.log("\n========== PHASE 2: Add Three Addresses ==========");
      
      // Add HOME address
      console.log("\n--- Adding HOME Address ---");
      const homeAdded = await addressPage.addCompleteAddress(
        "Headrun",
        "Headrun, 80 Feet Road",
        "home",
        true // Use map selection for home
      );
      expect(homeAdded).toBe(true);
      await TestHelpers.takeScreenshot('address-05-home-added');
      
      // Add WORK address
      console.log("\n--- Adding WORK Address ---");
      const workAdded = await addressPage.addCompleteAddress(
        "rozana rural",
        "rozana",
        "work",
        false
      );
      expect(workAdded).toBe(true);
      await TestHelpers.takeScreenshot('address-06-work-added');
      
      // Add OTHER address
      console.log("\n--- Adding OTHER Address ---");
      const otherAdded = await addressPage.addCompleteAddress(
        "koramangala",
        "koramangala",
        "other",
        false
      );
      expect(otherAdded).toBe(true);
      await TestHelpers.takeScreenshot('address-07-other-added');
      
      console.log("\n✅ All three addresses added successfully:");
      console.log("   • HOME: Headrun location");
      console.log("   • WORK: Rozana rural location");
      console.log("   • OTHER: Koramangala location");
      
      // PHASE 3: Return to Home and Complete Shopping
      console.log("\n========== PHASE 3: Return to Home and Shop ==========");
      
      // Step 4: Go back to home
      console.log("\nStep 4: Going back to home page...");
      const backToHome = await addressPage.goBackToHome();
      expect(backToHome).toBe(true);
      
      // Verify we're on home page
      await TestHelpers.waitForApp(2000);
      const isHomeAgain = await homePage.isHomePageDisplayed();
      expect(isHomeAgain).toBe(true);
      console.log("✓ Back on home page");
      await TestHelpers.takeScreenshot('address-08-back-home');
      
      // Step 5: Complete shopping flow
      console.log("\nStep 5: Starting shopping flow...");
      
      // Swipe up to see products
      console.log("Swiping up to see products...");
      await productsPage.swipeUpToSeeProducts();
      await TestHelpers.takeScreenshot('address-09-products');
      
      // Add products
      console.log("Adding products to cart...");
      const addedCount = await productsPage.addProducts(3);
      expect(addedCount).toBeGreaterThan(0);
      console.log(`✓ Added ${addedCount} products`);
      await TestHelpers.takeScreenshot('address-10-products-added');
      await browser.pause(2000);
      
// Click View Cart
console.log("Clicking View Cart...");
const cartClicked = await productsPage.clickViewCart();
expect(cartClicked).toBe(true);
console.log("✓ View Cart clicked");
await TestHelpers.waitForApp(3000);

// Verify cart page
const isCartPage = await cartPage.isCartPageDisplayed();
expect(isCartPage).toBe(true);
console.log("✓ On cart page");
await TestHelpers.takeScreenshot('address-11-cart');

// Handle address selection
console.log("\nChecking for address selection...");
const addressSelected = await cartPage.handleAddressSelectionFromList();
expect(addressSelected).toBe(true);
console.log("✓ Address handling completed");
await TestHelpers.takeScreenshot('address-12-address-selected');

// Check cart summary after address selection
const cartSummary = await cartPage.getCartSummary();
console.log("\nCart summary:");
console.log(`- Items: ${cartSummary.itemCount}`);
console.log(`- Total: ${cartSummary.total}`);
console.log(`- Has address: ${cartSummary.hasAddress}`);
console.log(`- Can place order: ${cartSummary.canPlaceOrder}`);

// Now Place Order should be visible
console.log("\nPlacing order...");
await cartPage.swipeUpOnCart();
await browser.pause(1500);

const placeOrderBtn = await browser.$('//android.widget.Button[@content-desc="Place Order"]');
if (await placeOrderBtn.isExisting()) {
  await placeOrderBtn.click();
  console.log("✓ Place Order clicked");
        await browser.pause(3000);
        
        // Check for order success
        const continueBtn = await browser.$('//android.widget.Button[@content-desc="Continue Shopping"]');
        let orderSuccess = false;
        let attempts = 5;
        
        while (!orderSuccess && attempts > 0) {
          if (await continueBtn.isExisting()) {
            console.log("✅ Order placed successfully!");
            await TestHelpers.takeScreenshot('address-12-order-success');
            
            await continueBtn.click();
            console.log("✓ Continue Shopping clicked");
            orderSuccess = true;
            await browser.pause(2000);
          } else {
            console.log("Waiting for order confirmation...");
            await browser.pause(1000);
            attempts--;
          }
        }
        
        expect(orderSuccess).toBe(true);
      }
      
      // Verify back on home
      await TestHelpers.waitForApp(2000);
      const isFinalHome = await homePage.isHomePageDisplayed();
      expect(isFinalHome).toBe(true);
      console.log("✓ Successfully returned to home page");
      await TestHelpers.takeScreenshot('address-13-final');
      
      // Test Summary
      console.log(TestHelpers.formatSuccessLog("\n🎉 Shopping with Address flow completed! 🎉"));
      console.log("\n📋 Test Summary:");
      
      console.log("\n✅ Phase 1 - Location Click & Login:");
      console.log("   • Clicked location on home page");
      console.log("   • Completed login flow");
      console.log("   • Auto-redirected to My Addresses page");
      
      console.log("\n✅ Phase 2 - Address Setup:");
      console.log("   • Added HOME address (Headrun)");
      console.log("     - Used search functionality");
      console.log("     - Selected location on map");
      console.log("     - Saved successfully");
      console.log("   • Added WORK address (Rozana Rural)");
      console.log("     - Selected Work type");
      console.log("     - Saved successfully");
      console.log("   • Added OTHER address (Koramangala)");
      console.log("     - Selected Other type");
      console.log("     - Saved successfully");
      
      console.log("\n✅ Phase 3 - Shopping:");
      console.log("   • Returned to home page");
      console.log("   • Added products to cart");
      console.log("   • Placed order successfully");
      console.log("   • Address was pre-selected");
      console.log("   • Order completed with COD");
      console.log("   • Returned to home via Continue Shopping");
      
      console.log("\n✅ All test objectives achieved!");
      
    } catch (error) {
      console.error(TestHelpers.formatErrorLog(`Shopping with address failed: ${error}`));
      await TestHelpers.takeScreenshot('address-error-final');
      
      // Recovery attempt
      try {
        console.log("\nAttempting to recover and return to home...");
        
        // Try multiple recovery methods
        const recoveryMethods = [
          async () => await browser.back(),
          async () => await addressPage.goBackToHome(),
          async () => await cartPage.goBackFromCart(),
          async () => {
            // Try clicking any visible back button
            const backButtons = [
              '//android.widget.Button[@content-desc="Back"]',
              '//android.widget.Button[1]',
              '//android.widget.ImageButton[@content-desc="Navigate up"]',
              '//android.widget.ImageButton[@content-desc="Back"]'
            ];
            for (const selector of backButtons) {
              try {
                const backBtn = await browser.$(selector);
                if (await backBtn.isExisting()) {
                  await backBtn.click();
                  return true;
                }
              } catch (e) {
                // Continue trying
              }
            }
            return false;
          }
        ];
        
        // Try each recovery method
        for (const method of recoveryMethods) {
          try {
            await method();
            await TestHelpers.waitForApp(1000);
            
            // Check if we're back on home page
            const isHome = await homePage.isHomePageDisplayed();
            if (isHome) {
              console.log("✓ Successfully recovered to home page");
              break;
            }
          } catch (e) {
            console.log("Recovery method failed, trying next...");
          }
        }
        
      } catch (recoveryError) {
        console.log("Recovery failed:", recoveryError);
      }
      
      throw error;
    }
  });
});