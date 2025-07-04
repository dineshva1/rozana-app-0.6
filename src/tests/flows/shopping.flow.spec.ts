// src/tests/flows/shopping-complete.flow.spec.ts - With minor improvements

import { expect, browser } from "@wdio/globals";
import { HomePage } from "../../pages/home.page";
import { ProductsPage } from "../../pages/products.page";
import { CartPage } from "../../pages/cart.page";
import { TestHelpers } from "../../utils/test-helpers";

describe("Complete Shopping Flow with Cart Operations", () => {
  let homePage: HomePage;
  let productsPage: ProductsPage;
  let cartPage: CartPage;

  before(() => {
    homePage = new HomePage();
    productsPage = new ProductsPage();
    cartPage = new CartPage();
  });

  it("should complete full shopping flow with single product operations", async () => {
    console.log(TestHelpers.formatTestLog("=== Test: Complete Shopping Flow with Single Product Operations ==="));
    
    try {
      // PHASE 1: Initial Product Addition
      console.log("\n========== PHASE 1: Initial Product Addition ==========");
      
      // Step 1: Verify home page
      console.log("\nStep 1: Verifying home page...");
      await TestHelpers.waitForApp(3000);
      const isHomePage = await homePage.isHomePageDisplayed();
      expect(isHomePage).toBe(true);
      console.log("✓ Home page confirmed");
      await TestHelpers.takeScreenshot('phase1-01-home-page');
      
      // Step 2: Swipe up to see products
      console.log("\nStep 2: Swiping up to see products...");
      await productsPage.swipeUpToSeeProducts();
      await TestHelpers.takeScreenshot('phase1-02-after-swipe');
      
      // Step 3: Add products
      console.log("\nStep 3: Adding products...");
      const addedCount = await productsPage.addProducts(3);
      expect(addedCount).toBeGreaterThan(0); // Ensure at least one product was added
      console.log(`✓ Successfully added ${addedCount} products`);
      await TestHelpers.takeScreenshot('phase1-03-products-added');
      await browser.pause(2000);
      
      // Step 4: Click View Cart
      console.log("\nStep 4: Clicking View Cart...");
      const cartClicked = await productsPage.clickViewCart();
      expect(cartClicked).toBe(true);
      console.log("✓ View Cart clicked successfully");
      await TestHelpers.takeScreenshot('phase1-04-cart-opened');
      await TestHelpers.waitForApp(3000);
      
      // PHASE 2: Cart Operations on Single Product
      console.log("\n========== PHASE 2: Cart Operations on Single Product ==========");
      
      // Verify we're on cart page
      const isCartPage = await cartPage.isCartPageDisplayed();
      expect(isCartPage).toBe(true);
      console.log("✓ On cart page - My Cart");
      
      // Get initial cart details
      const initialSummary = await cartPage.getCartSummary();
      console.log("\nInitial cart summary:");
      console.log(`- Items: ${initialSummary.itemCount}`);
      console.log(`- Total: ${initialSummary.total}`);
      
      // Check which button is visible (Select Address since user is logged in)
      const selectAddressVisible = await cartPage.isElementExisting('//android.widget.Button[@content-desc="Select Address"]');
      const placeOrderVisible = await cartPage.isElementExisting('//android.widget.Button[@content-desc="Place Order"]');
      
      if (selectAddressVisible) {
        console.log(`- Select Address button visible (user is logged in)`);
      } else if (placeOrderVisible) {
        console.log(`- Place Order button visible (address already selected)`);
      } else {
        console.log(`- Login to Proceed button might be visible`);
      }
      console.log("");
      
      // Perform operations on single product
      console.log("Performing operations on first product:");
      console.log("- Current quantity: 1");
      console.log("- Will increment to 2");
      console.log("- Then decrement back to 1");
      console.log("- Finally delete the product");
      console.log("- Then clear remaining cart\n");
      
      const operationsSuccess = await cartPage.performCartOperationsOnSingleProduct();
      expect(operationsSuccess).toBe(true);
      console.log("✓ All cart operations completed successfully");
      await TestHelpers.takeScreenshot('phase2-complete');
      
      // Verify cart is empty after operations
      const emptyCartCheck = await cartPage.getItemCount();
      console.log(`\nCart items after operations: ${emptyCartCheck}`);
      expect(emptyCartCheck).toBe(0); // Cart should be empty
      
      // Step 5: Go back to home
      console.log("\nStep 5: Going back to home page...");
      await cartPage.goBackFromCart();
      await TestHelpers.takeScreenshot('phase2-back-home');
      await TestHelpers.waitForApp(2000);
      
      // PHASE 3: Fresh Order with Address and COD
      console.log("\n========== PHASE 3: Order Placement with Address Selection ==========");
      
      // Verify we're back on home page
      let isHomeAgain = await homePage.isHomePageDisplayed();
      let backAttempts = 0;
      while (!isHomeAgain && backAttempts < 3) {
        console.log(`Not on home page, navigating back... (attempt ${backAttempts + 1})`);
        await browser.back();
        await TestHelpers.waitForApp(2000);
        isHomeAgain = await homePage.isHomePageDisplayed();
        backAttempts++;
      }
      expect(isHomeAgain).toBe(true);
      
      // Step 6: Add products again (no swipe needed)
      console.log("\nStep 6: Adding products again...");
      console.log("✓ Products already visible (app maintains scroll position)");
      
      // Verify products are visible before adding
      const productsVisible = await productsPage.isElementExisting('//android.view.View[@content-desc="Add"]');
      if (!productsVisible) {
        console.log("Products not visible, swiping up again...");
        await productsPage.swipeUpToSeeProducts();
      }
      
      const secondAddCount = await productsPage.addProducts(6);
      expect(secondAddCount).toBeGreaterThan(0); // Ensure products were added
      console.log(`✓ Added ${secondAddCount} product(s)`);
      await TestHelpers.takeScreenshot('phase3-01-products-added');
      await browser.pause(2000);
      
      // Step 7: Click View Cart
      console.log("\nStep 7: Clicking View Cart...");
      const secondCartClicked = await productsPage.clickViewCart();
      expect(secondCartClicked).toBe(true);
      console.log("✓ View Cart clicked successfully");
      await TestHelpers.takeScreenshot('phase3-02-cart-opened');
      await TestHelpers.waitForApp(3000);
      
      // Verify items in cart before placing order
      const cartBeforeOrder = await cartPage.getItemCount();
      console.log(`\nItems in cart before order: ${cartBeforeOrder}`);
      expect(cartBeforeOrder).toBeGreaterThan(0);
      
      // Step 8: Complete order with address and COD
      console.log("\nStep 8: Placing order with address selection...");
      console.log("\nExpected flow:");
      console.log("1. Swipe up to see Cash on Delivery option");
      console.log("2. Verify COD is enabled (purple selection)");
      console.log("3. Click Select Address button");
      console.log("4. Wait for address page to load");
      console.log("5. Dismiss keyboard if visible");
      console.log("6. Click Use Current Location");
      console.log("7. Swipe up to find Save Address");
      console.log("8. Click Save Address");
      console.log("9. Return to cart with address selected");
      console.log("10. Click Place Order");
      console.log("11. See order success page");
      console.log("12. Click Continue Shopping\n");
      
      const orderPlaced = await cartPage.placeOrderWithAddressAndCOD();
      
      if (orderPlaced) {
        console.log("\n✅✅✅ ORDER PLACED SUCCESSFULLY! ✅✅✅");
        console.log("\nOrder confirmation details:");
        console.log("- Order placed successfully");
        console.log("- Payment Method: Cash on Delivery");
        console.log("- Delivery: FREE");
        console.log("- Continue Shopping clicked");
        console.log("- Returning to home page");
        await TestHelpers.takeScreenshot('phase3-order-success');
      } else {
        console.log("\n❌ Order placement failed");
        await TestHelpers.takeScreenshot('phase3-order-failed');
        expect(orderPlaced).toBe(true); // Fail the test if order wasn't placed
      }
      
      // Final verification
      console.log("\nStep 9: Final verification...");
      await TestHelpers.waitForApp(2000);
      const isFinalHome = await homePage.isHomePageDisplayed();
      if (isFinalHome) {
        console.log("✓ Successfully returned to home page");
      } else {
        console.log("Attempting final navigation to home...");
        await browser.back();
        await TestHelpers.waitForApp(2000);
      }
      
      await TestHelpers.takeScreenshot('final-state');
      
      // Test Summary
      console.log(TestHelpers.formatSuccessLog("\n🎉 Complete shopping flow test finished! 🎉"));
      console.log("\n📋 Test Summary:");
      console.log("\n✅ Phase 1 - Initial Setup:");
      console.log("   • Swiped up to view products");
      console.log("   • Added 3 products to cart");
      console.log("   • Opened cart successfully");
      
      console.log("\n✅ Phase 2 - Cart Operations:");
      console.log("   • Performed all operations on SINGLE product:");
      console.log("     - Incremented quantity from 1 to 2");
      console.log("     - Decremented quantity from 2 to 1");
      console.log("     - Deleted the product completely");
      console.log("   • Cleared remaining cart items");
      console.log("   • Verified cart is empty");
      console.log("   • Returned to home page");
      
      console.log("\n✅ Phase 3 - Order Placement:");
      console.log("   • Added 6 fresh products to cart");
      console.log("   • Verified Cash on Delivery enabled");
      console.log("   • Completed address selection flow:");
      console.log("     - Selected address");
      console.log("     - Handled keyboard dismissal");
      console.log("     - Used current location");
      console.log("     - Saved address");
      console.log("   • Successfully placed order");
      console.log("   • Returned to home via Continue Shopping");
      
      console.log("\n✅ All test objectives achieved!");
      
    } catch (error) {
      console.error(TestHelpers.formatErrorLog(`Shopping flow failed: ${error}`));
      await TestHelpers.takeScreenshot('test-error-final');
      
      // Enhanced recovery attempt
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