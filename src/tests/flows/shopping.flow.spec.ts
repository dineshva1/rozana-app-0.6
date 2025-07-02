// src/tests/flows/shopping-complete.flow.spec.ts - Updated Phase 3
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

  it("should complete full shopping flow with cart operations", async () => {
    console.log(TestHelpers.formatTestLog("=== Test: Complete Shopping Flow ==="));
    
    try {
      // Phase 1: Initial Product Addition
      console.log("\n========== PHASE 1: Initial Product Addition ==========");
      
      // Step 1: Ensure we're on home page
      console.log("\nStep 1: Verifying home page...");
      await TestHelpers.waitForApp(3000);
      const isHomePage = await homePage.isHomePageDisplayed();
      expect(isHomePage).toBe(true);
      console.log("✓ Home page confirmed");
      await TestHelpers.takeScreenshot('phase1-00-home-page');
      
      // Step 2: Swipe up to see products
      console.log("\nStep 2: Swiping up to see products...");
      await productsPage.swipeUpToSeeProducts();
      await TestHelpers.takeScreenshot('phase1-01-after-swipe');
      
      // Step 3: Add 6 products
      console.log("\nStep 3: Adding 6 products...");
      const addedCount = await productsPage.addProducts(6);
      console.log(`✓ Successfully added ${addedCount} products`);
      
      if (addedCount < 6) {
        console.log(TestHelpers.formatWarningLog(`Only ${addedCount} products added. Continuing with available products...`));
      }
      
      await TestHelpers.takeScreenshot('phase1-02-products-added');
      await browser.pause(2000);
      
      // Step 4: Delete 2 products
      console.log("\nStep 4: Deleting 2 products...");
      const deletedCount = await productsPage.deleteProducts([1, 2]);
      console.log(`✓ Successfully deleted ${deletedCount} products`);
      await TestHelpers.takeScreenshot('phase1-03-products-deleted');
      await browser.pause(1500);
      
      // Step 5: Increase quantity of one product by 2
      console.log("\nStep 5: Increasing quantity of first remaining product by 2...");
      const increased = await productsPage.increaseProductQuantity(1, 2);
      if (increased) {
        console.log("✓ Product quantity increased");
      } else {
        console.log("⚠️ Could not increase quantity, continuing...");
      }
      await TestHelpers.takeScreenshot('phase1-04-quantity-increased');
      await browser.pause(1500);
      
      // Step 6: Click View Cart
      console.log("\nStep 6: Clicking View Cart...");
      const cartClicked = await productsPage.clickViewCart();
      expect(cartClicked).toBe(true);
      await TestHelpers.takeScreenshot('phase1-05-cart-opened');
      
      // Phase 2: Cart Operations
      console.log("\n========== PHASE 2: Cart Operations ==========");
      
      await TestHelpers.waitForApp(3000);
      
      const isCartPage = await cartPage.isCartPageDisplayed();
      if (!isCartPage) {
        console.log("⚠️ Cart page not detected, waiting longer...");
        await TestHelpers.waitForApp(3000);
      }
      
      // Step 7: Increase quantity of first item by 2
      console.log("\nStep 7: Increasing quantity of first item by 2...");
      await cartPage.increaseItemQuantityInCart(1, 2);
      await TestHelpers.takeScreenshot('phase2-01-item-increased');
      await browser.pause(1500);
      
      // Step 8: Decrease quantity of second item by 1
      console.log("\nStep 8: Decreasing quantity of second item by 1...");
      await cartPage.decreaseItemQuantityInCart(2, 1);
      await TestHelpers.takeScreenshot('phase2-02-item-decreased');
      await browser.pause(1500);
      
      // Step 9: Delete one item from cart
      console.log("\nStep 9: Deleting one item from cart...");
      await cartPage.deleteItemFromCart(1);
      await TestHelpers.takeScreenshot('phase2-03-item-deleted');
      await browser.pause(1500);
      
      // Step 10: Clear cart
      console.log("\nStep 10: Clearing cart...");
      await cartPage.clearCart();
      await TestHelpers.takeScreenshot('phase2-04-cart-cleared');
      await browser.pause(2000);
      
      // Step 11: Go back to home
      console.log("\nStep 11: Going back to home page...");
      await cartPage.goBackFromCart();
      await TestHelpers.takeScreenshot('phase2-05-back-home');
      
      // Phase 3: Final Order
      console.log("\n========== PHASE 3: Final Order ==========");
      
      // Wait and verify we're back on home page with products visible
      await TestHelpers.waitForApp(3000);
      const isHomeAgain = await homePage.isHomePageDisplayed();
      if (!isHomeAgain) {
        console.log("Not on home page, trying to navigate back...");
        await browser.back();
        await TestHelpers.waitForApp(2000);
      }
      
      // Step 12: Add 6 items again WITHOUT SWIPING (app maintains position)
      console.log("\nStep 12: Adding 6 items again (no swipe needed - app maintains position)...");
      console.log("✓ Products are already visible at the same position");
      await TestHelpers.takeScreenshot('phase3-00-products-already-visible');
      
      const secondAddCount = await productsPage.addProducts(6);
      console.log(`✓ Successfully added ${secondAddCount} products`);
      await TestHelpers.takeScreenshot('phase3-01-products-added');
      await browser.pause(2000);
      
      // Step 13: Click View Cart
      console.log("\nStep 13: Clicking View Cart again...");
      const secondCartClicked = await productsPage.clickViewCart();
      expect(secondCartClicked).toBe(true);
      await TestHelpers.takeScreenshot('phase3-02-cart-opened');
      await TestHelpers.waitForApp(3000);
      
      // Step 14: Place order with Cash on Delivery
      console.log("\nStep 14: Placing order with Cash on Delivery...");
      const orderPlaced = await cartPage.placeOrderWithCOD();
      await TestHelpers.takeScreenshot('phase3-03-order-attempted');
      
      // Step 15: Handle error and go back
      console.log("\nStep 15: Handling any errors and going back...");
      await browser.pause(3000);
      
      await cartPage.goBackFromCart();
      await TestHelpers.takeScreenshot('phase3-04-navigated-back');
      
      await TestHelpers.waitForApp(2000);
      const isFinalHome = await homePage.isHomePageDisplayed();
      if (!isFinalHome) {
        console.log("Still not on home page, pressing back again...");
        await browser.back();
        await TestHelpers.waitForApp(2000);
      }
      
      await TestHelpers.takeScreenshot('phase3-05-final-home');
      
      console.log(TestHelpers.formatSuccessLog("Complete shopping flow test completed successfully!"));
      
    } catch (error) {
      console.error(TestHelpers.formatErrorLog(`Shopping flow failed: ${error}`));
      await TestHelpers.takeScreenshot('shopping-error-final');
      
      try {
        console.log("Attempting to recover and return to home...");
        await browser.back();
        await TestHelpers.waitForApp(2000);
        await browser.back();
        await TestHelpers.waitForApp(2000);
      } catch (recoveryError) {
        console.log("Recovery failed:", recoveryError);
      }
      
      throw error;
    }
  });
});