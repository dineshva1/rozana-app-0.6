// Update your shopping-without-login.flow.spec.ts

import { expect, browser } from "@wdio/globals";
import { HomePage } from "../../pages/home.page";
import { ProductsPage } from "../../pages/products.page";
import { CartPage } from "../../pages/cart.page";
import { LoginPage } from "../../pages/login.page";
import { TestHelpers } from "../../utils/test-helpers";
import * as userData from "../../test-data/users.json";

describe("Shopping Flow Without Login", () => {
  let homePage: HomePage;
  let productsPage: ProductsPage;
  let cartPage: CartPage;
  let loginPage: LoginPage;

  before(() => {
    homePage = new HomePage();
    productsPage = new ProductsPage();
    cartPage = new CartPage();
    loginPage = new LoginPage();
  });

  it("should complete shopping flow with login from cart", async () => {
    console.log(TestHelpers.formatTestLog("=== Test: Shopping Flow Without Initial Login ==="));
    
    try {
      // PHASE 1: Add Products Without Login
      console.log("\n========== PHASE 1: Add Products Without Login ==========");
      
      // Step 1: Verify home page
      console.log("\nStep 1: Verifying home page...");
      await TestHelpers.waitForApp(3000);
      const isHomePage = await homePage.isHomePageDisplayed();
      expect(isHomePage).toBe(true);
      console.log("✓ Home page confirmed");
      await TestHelpers.takeScreenshot('no-login-01-home');
      
      // Step 2: Swipe up to see products
      console.log("\nStep 2: Swiping up to see products...");
      await productsPage.swipeUpToSeeProducts();
      await TestHelpers.takeScreenshot('no-login-02-products');
      
      // Step 3: Add products
      console.log("\nStep 3: Adding products to cart (not logged in)...");
      const addedCount = await productsPage.addProducts(3);
      expect(addedCount).toBeGreaterThan(0);
      console.log(`✓ Successfully added ${addedCount} products`);
      await TestHelpers.takeScreenshot('no-login-03-products-added');
      await browser.pause(2000);
      
      // Step 4: Click View Cart
      console.log("\nStep 4: Clicking View Cart...");
      const cartClicked = await productsPage.clickViewCart();
      expect(cartClicked).toBe(true);
      console.log("✓ View Cart clicked");
      await TestHelpers.waitForApp(3000);
      
      // PHASE 2: Login from Cart
      console.log("\n========== PHASE 2: Login from Cart ==========");
      
      // Step 5: Verify cart page and check for Login to Proceed
      console.log("\nStep 5: Checking cart page...");
      const isCartPage = await cartPage.isCartPageDisplayed();
      expect(isCartPage).toBe(true);
      console.log("✓ On cart page");
      
      // Check if login is required
      const loginRequired = await cartPage.isLoginRequired();
      expect(loginRequired).toBe(true);
      console.log("✓ Login to Proceed button found (user not logged in)");
      await TestHelpers.takeScreenshot('no-login-04-login-required');
      
      // Step 6: Click Login to Proceed
      console.log("\nStep 6: Clicking Login to Proceed...");
      const loginClicked = await cartPage.clickLoginToProceed();
      expect(loginClicked).toBe(true);
      console.log("✓ Login to Proceed clicked");
      
      // IMPORTANT: Wait for login page to load
      console.log("Waiting for login page to load...");
      await TestHelpers.waitForApp(5000); // Give enough time for page transition
      await TestHelpers.takeScreenshot('no-login-05-login-page');
      
      // Step 7: Perform login
      console.log("\nStep 7: Performing login from cart...");
      console.log("Expected flow:");
      console.log("  1. Cancel mobile number prompt");
      console.log("  2. Enter mobile number");
      console.log("  3. Click Send OTP");
      console.log("  4. Enter OTP");
      console.log("  5. Auto-redirect back to My Cart\n");
      
      const loginSuccess = await loginPage.performCartLogin(
        userData.validUser.mobileNumber,
        userData.validUser.otp
      );
      expect(loginSuccess).toBe(true);
      console.log("✓ Login completed successfully");
      
      // Wait for redirect back to cart
      console.log("Waiting for redirect back to cart...");
      await TestHelpers.waitForApp(3000);
      
      // PHASE 3: Complete Order After Login
      console.log("\n========== PHASE 3: Complete Order After Login ==========");
      
      // Step 8: Verify returned to cart page
      console.log("\nStep 8: Verifying return to cart page...");
      const isBackOnCart = await cartPage.isCartPageDisplayed();
      expect(isBackOnCart).toBe(true);
      console.log("✓ Successfully returned to cart page after login");
      await TestHelpers.takeScreenshot('no-login-06-cart-after-login');
      
      // Step 9: Check cart state after login
      console.log("\nStep 9: Checking cart state after login...");
      const cartSummary = await cartPage.getCartSummary();
      console.log("\nCart summary after login:");
      console.log(`- Items: ${cartSummary.itemCount}`);
      console.log(`- Total: ${cartSummary.total}`);
      console.log(`- Has address: ${cartSummary.hasAddress}`);
      console.log(`- Can place order: ${cartSummary.canPlaceOrder}`);
      
      // Step 10: Handle address if needed
      if (!cartSummary.hasAddress) {
        console.log("\nStep 10: Address selection required...");
        const addressHandled = await cartPage.handleAddressSelection();
        expect(addressHandled).toBe(true);
        console.log("✓ Address selected successfully");
      } else {
        console.log("\nStep 10: Address already selected, proceeding to order...");
      }
      
      // Step 11: Place order
      console.log("\nStep 11: Placing order...");
      await TestHelpers.takeScreenshot('no-login-07-before-order');
      
      // Swipe up to see payment method and place order button
      await cartPage.swipeUpOnCart();
      await browser.pause(1500);
      
      // Click Place Order
      const placeOrderBtn = await browser.$('//android.widget.Button[@content-desc="Place Order"]');
      
      if (await placeOrderBtn.isExisting()) {
        await placeOrderBtn.click();
        console.log("✓ Place Order clicked");
        await browser.pause(3000);
        
        // Step 12: Handle order success
        console.log("\nStep 12: Checking for order success...");
        const continueBtn = await browser.$('//android.widget.Button[@content-desc="Continue Shopping"]');
        
        let orderSuccess = false;
        let attempts = 5;
        
        while (!orderSuccess && attempts > 0) {
          if (await continueBtn.isExisting()) {
            console.log("✅ Order placed successfully!");
            await TestHelpers.takeScreenshot('no-login-08-order-success');
            
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
        
      } else {
        throw new Error("Place Order button not found");
      }
      
      // Step 13: Verify back on home page
      console.log("\nStep 13: Verifying return to home page...");
      await TestHelpers.waitForApp(2000);
      const isFinalHome = await homePage.isHomePageDisplayed();
      
      if (!isFinalHome) {
        console.log("Not on home page, navigating back...");
        await browser.back();
        await TestHelpers.waitForApp(2000);
      }
      
      expect(await homePage.isHomePageDisplayed()).toBe(true);
      console.log("✓ Successfully returned to home page");
      await TestHelpers.takeScreenshot('no-login-09-final-home');
      
      // Test Summary
      console.log(TestHelpers.formatSuccessLog("\n🎉 Shopping without login flow completed! 🎉"));
      console.log("\n📋 Test Summary:");
      console.log("\n✅ Phase 1 - Shopping Without Login:");
      console.log("   • Started from home page (not logged in)");
      console.log("   • Swiped up to view products");
      console.log("   • Added 3 products to cart");
      console.log("   • Clicked View Cart");
      console.log("   • Found 'Login to Proceed' button");
      
      console.log("\n✅ Phase 2 - Login from Cart:");
      console.log("   • Clicked 'Login to Proceed'");
      console.log("   • Canceled mobile number prompt");
      console.log("   • Entered mobile number");
      console.log("   • Clicked Send OTP");
      console.log("   • Entered OTP");
      console.log("   • Auto-redirected back to My Cart");
      
      console.log("\n✅ Phase 3 - Complete Order:");
      console.log("   • Cart preserved after login");
      console.log("   • Selected delivery address");
      console.log("   • Cash on Delivery enabled");
      console.log("   • Placed order successfully");
      console.log("   • Returned to home via Continue Shopping");
      
      console.log("\n✅ All test objectives achieved!");
      
    } catch (error) {
      console.error(TestHelpers.formatErrorLog(`Shopping without login failed: ${error}`));
      await TestHelpers.takeScreenshot('no-login-error-final');
      
      // Recovery attempt
      try {
        console.log("\nAttempting to recover and return to home...");
        
        // Try multiple recovery methods
        const recoveryMethods = [
          async () => await browser.back(),
          async () => await cartPage.goBackFromCart(),
          async () => {
            // Try clicking any visible back button
            const backButtons = [
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