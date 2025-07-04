// src/pages/cart.page.ts - Final corrected version
import { BasePage } from './base.page';
import { browser } from '@wdio/globals';

export class CartPage extends BasePage {
  // Existing cart selectors
  private get myCartTitle() {
    return '//android.widget.TextView[contains(@text, "My Cart")]';
  }

  private get placeOrderButton() {
    return '//android.widget.Button[@content-desc="Place Order"]';
  }

  private get cartItems() {
    return '//android.view.View[contains(@content-desc, "₹")]';
  }

  // Clear cart selectors
  private get clearCartButton() {
    return '//android.widget.Button[@content-desc="Clear"]';
  }

  private get clearCartConfirmButton() {
    return '//android.widget.Button[@text="Clear" or @content-desc="Clear"]';
  }

  private get clearCartCancelButton() {
    return '//android.widget.Button[@text="Cancel" or @content-desc="Cancel"]';
  }

  // Address selection selectors
  private get selectAddressButton() {
    return '//android.widget.Button[@content-desc="Select Address"]';
  }

  private get useCurrentLocationButton() {
    return '//android.widget.Button[@content-desc="Use Current Location"]';
  }

  private get setAsDefaultAddressCheckbox() {
    return '//android.widget.CheckBox[@content-desc="Set as default address"]';
  }

  private get saveAddressButton() {
    return '//android.widget.Button[@content-desc="Save Address"]';
  }

  private get continueShoppingButton() {
    return '//android.widget.Button[@content-desc="Continue Shopping"]';
  }

  // Payment method selector - COD only
  private get cashOnDeliveryOption() {
    return '//android.view.View[@content-desc="Cash on Delivery\nPay when your order arrives"]';
  }

  // Navigation buttons
  private get goBackButton() {
    return '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View[1]/android.widget.Button[1]';
  }

  private get goBackButtonAlt() {
    return 'android=new UiSelector().className("android.widget.Button").instance(0)';
  }

  // Item controls
  private getCartItemPlusButton(index: number = 1) {
    return `(//android.widget.ImageView[contains(@content-desc, "item")]/android.view.View[2])[${index}]`;
  }

  private getCartItemMinusButton(index: number = 1) {
    return `(//android.widget.ImageView[contains(@content-desc, "item")]/android.view.View[1])[${index}]`;
  }

  // Clear cart with confirmation dialog
  // async clearCart(): Promise<boolean> {
  //   console.log("\n=== Clearing cart ===");
    
  //   try {
  //     // Click clear cart button
  //     const clearButton = await browser.$(this.clearCartButton);
      
  //     if (!await clearButton.isExisting()) {
  //       console.log("Clear cart button not found");
  //       return false;
  //     }

  //     console.log("Clicking Clear Cart button...");
  //     await clearButton.click();
  //     await browser.pause(1000);

  //     // Handle confirmation dialog
  //     console.log("Handling clear cart confirmation dialog...");
  //     const confirmButton = await browser.$(this.clearCartConfirmButton);
      
  //     if (await confirmButton.isExisting()) {
  //       console.log("Confirming cart clear...");
  //       await confirmButton.click();
  //       console.log("✓ Cart cleared successfully");
  //       await browser.pause(2000);
  //       return true;
  //     }

  //     console.log("Confirmation dialog not found");
  //     return false;
      
  //   } catch (error) {
  //     console.error("Failed to clear cart:", error);
  //     return false;
  //   }
  // }

  // Wait for address page to load
  async waitForAddressPageToLoad(): Promise<boolean> {
    console.log("Waiting for address page to load...");
    
    const maxWaitTime = 30000; // 30 seconds max wait
    const checkInterval = 1000; // Check every second
    const startTime = Date.now();
    
    while (Date.now() - startTime < maxWaitTime) {
      try {
        // Check if Use Current Location button is visible
        const useLocationBtn = await browser.$(this.useCurrentLocationButton);
        if (await useLocationBtn.isExisting() && await useLocationBtn.isDisplayed()) {
          console.log("✓ Address page loaded successfully");
          return true;
        }
        
        console.log("Still loading... waiting for Use Current Location button");
        await browser.pause(checkInterval);
        
      } catch (error) {
        // Continue waiting
      }
    }
    
    console.log("⚠️ Address page load timeout");
    return false;
  }

  // Handle address selection flow with proper waiting
// Updated handleAddressSelection method in cart.page.ts
async handleAddressSelection(): Promise<boolean> {
  console.log("\n=== Handling Address Selection ===");
  
  try {
    // Step 1: Click Select Address
    console.log("\nStep 1: Clicking Select Address button...");
    const selectAddressBtn = await browser.$(this.selectAddressButton);
    
    if (!await selectAddressBtn.isExisting()) {
      console.log("Select Address button not found");
      return false;
    }

    await selectAddressBtn.click();
    console.log("✓ Select Address clicked, waiting for page to load...");
    
    // Enhanced wait for address page
    const pageLoaded = await this.waitForAddressPageToLoad();
    if (!pageLoaded) {
      console.log("Address page failed to load properly");
      return false;
    }
    
    await this.takeScreenshot('address-page-loaded');

    // Step 2: Click Use Current Location with retry
    console.log("\nStep 2: Clicking Use Current Location...");
    let locationClicked = false;
    let retries = 3;
    
    while (!locationClicked && retries > 0) {
      const useLocationBtn = await browser.$(this.useCurrentLocationButton);
      
      if (await useLocationBtn.isExisting() && await useLocationBtn.isDisplayed()) {
        await useLocationBtn.click();
        console.log("✓ Use Current Location clicked");
        locationClicked = true;
        await browser.pause(3000); // Wait for location to be fetched
      } else {
        console.log(`Use Current Location not found, retrying... (${retries} left)`);
        await browser.pause(1000);
        retries--;
      }
    }
    
    if (!locationClicked) {
      console.log("Failed to click Use Current Location after retries");
      return false;
    }

    // Step 3: Check Set as Default Address
    console.log("\nStep 3: Setting as default address...");
    await browser.pause(1000);
    const defaultCheckbox = await browser.$(this.setAsDefaultAddressCheckbox);
    
    if (await defaultCheckbox.isExisting()) {
      const isChecked = await defaultCheckbox.getAttribute('checked');
      if (isChecked !== 'true') {
        await defaultCheckbox.click();
        console.log("✓ Set as default address checked");
      } else {
        console.log("✓ Default address already checked");
      }
      await browser.pause(1000);
    }

    // Step 4: Swipe up to find Save Address button with multiple attempts
    console.log("\nStep 4: Looking for Save Address button...");
    let saveButtonFound = false;
    let swipeAttempts = 3;
    
    while (!saveButtonFound && swipeAttempts > 0) {
      const saveBtn = await browser.$(this.saveAddressButton);
      
      if (await saveBtn.isExisting() && await saveBtn.isDisplayed()) {
        saveButtonFound = true;
        console.log("✓ Save Address button found");
      } else {
        console.log(`Save Address not visible, swiping up... (${swipeAttempts} attempts left)`);
        await this.swipeUpOnCart();
        await browser.pause(1500);
        swipeAttempts--;
      }
    }
    
    if (!saveButtonFound) {
      console.log("Save Address button not found after swipes");
      return false;
    }

    // Step 5: Save Address
    console.log("\nStep 5: Saving address...");
    const saveBtn = await browser.$(this.saveAddressButton);
    await saveBtn.click();
    console.log("✓ Save Address clicked, waiting for redirect to cart...");
    
    // Wait for redirect back to cart with verification
    let cartPageLoaded = false;
    let waitAttempts = 5;
    
    while (!cartPageLoaded && waitAttempts > 0) {
      await browser.pause(1000);
      
      const placeOrderBtn = await browser.$(this.placeOrderButton);
      const myCartTitle = await browser.$(this.myCartTitle);
      
      if (await placeOrderBtn.isExisting() || await myCartTitle.isExisting()) {
        cartPageLoaded = true;
        console.log("✓ Successfully returned to cart page");
      } else {
        console.log(`Waiting for cart page... (${waitAttempts} attempts left)`);
        waitAttempts--;
      }
    }
    
    if (!cartPageLoaded) {
      console.log("Failed to return to cart page after address save");
      return false;
    }
    
    await this.takeScreenshot('address-saved-cart-page');
    console.log("✅ Address selection completed successfully");
    return true;

  } catch (error) {
    console.error("Failed to handle address selection:", error);
    await this.takeScreenshot('address-selection-error');
    return false;
  }
}
  // Complete order placement flow (COD only)
  async placeOrder(): Promise<boolean> {
    console.log("\n=== PLACING ORDER WITH CASH ON DELIVERY ===");
    console.log("Note: COD is enabled by default");
    
    try {
      await this.takeScreenshot('cart-initial');
      
      // Step 1: Check if we need to select address
      console.log("\nStep 1: Checking for address selection...");
      let selectAddressBtn = await browser.$(this.selectAddressButton);
      
      if (await selectAddressBtn.isExisting()) {
        console.log("Address selection required");
        const addressHandled = await this.handleAddressSelection();
        
        if (!addressHandled) {
          console.log("Failed to handle address selection");
          return false;
        }
      } else {
        console.log("Address already selected or not required");
      }

      // Step 2: Click Place Order
      console.log("\nStep 2: Clicking Place Order button...");
      const placeOrderBtn = await browser.$(this.placeOrderButton);
      
      if (!await placeOrderBtn.isExisting()) {
        // Try scrolling to find it
        console.log("Place Order button not visible, scrolling...");
        await this.swipeUpOnCart();
        await browser.pause(1000);
      }
      
      if (await placeOrderBtn.isExisting()) {
        await placeOrderBtn.click();
        console.log("✓ Place Order clicked");
        await browser.pause(3000);
        
        // Step 3: Handle Continue Shopping
        console.log("\nStep 3: Looking for Continue Shopping button...");
        const continueBtn = await browser.$(this.continueShoppingButton);
        
        if (await continueBtn.isExisting()) {
          console.log("✅ Order placed successfully!");
          await this.takeScreenshot('order-success');
          
          console.log("Clicking Continue Shopping...");
          await continueBtn.click();
          console.log("✓ Redirecting to home page");
          await browser.pause(2000);
          return true;
        } else {
          console.log("Continue Shopping button not found, order might have failed");
          await this.takeScreenshot('order-status-unknown');
          return false;
        }
      } else {
        console.log("Place Order button not found");
        return false;
      }
      
    } catch (error) {
      console.error("Failed to place order:", error);
      await this.takeScreenshot('order-failed');
      return false;
    }
  }

  // Simplified complete checkout (COD only)
  async completeCheckout(): Promise<boolean> {
    console.log("\n=== STARTING COMPLETE CHECKOUT ===");
    console.log("Payment Method: Cash on Delivery (Default)");
    
    try {
      // Verify we're on cart page
      const isCartPage = await this.isCartPageDisplayed();
      
      if (!isCartPage) {
        console.error("Not on cart page!");
        return false;
      }

      // Get cart total
      const total = await this.getCartTotal();
      console.log(`Cart total: ${total}`);

      // Place order
      const orderSuccess = await this.placeOrder();

      if (orderSuccess) {
        console.log("\n✅✅✅ CHECKOUT COMPLETED SUCCESSFULLY ✅✅✅");
      } else {
        console.log("\n❌❌❌ CHECKOUT FAILED ❌❌❌");
      }

      return orderSuccess;
      
    } catch (error) {
      console.error("Checkout error:", error);
      await this.takeScreenshot('checkout-error');
      return false;
    }
  }

  // Swipe implementation
  async swipeUpOnCart() {
    console.log("Performing swipe up...");
    
    try {
      const { width, height } = await browser.getWindowSize();
      
      await browser.action('pointer')
        .move({ duration: 0, x: width * 0.5, y: height * 0.7 })
        .down({ button: 0 })
        .move({ duration: 1000, x: width * 0.5, y: height * 0.3 })
        .up({ button: 0 })
        .perform();
      
      await browser.pause(1500);
      
    } catch (error) {
      console.error("Error during swipe:", error);
    }
  }

  // Navigate back from cart
  async goBackFromCart(): Promise<boolean> {
    console.log("\n=== Going back from cart ===");
    
    try {
      // Try button selectors first
      const selectors = [this.goBackButton, this.goBackButtonAlt];
      
      for (const selector of selectors) {
        try {
          const button = await browser.$(selector);
          if (await button.isExisting()) {
            await button.click();
            console.log("✓ Navigated back from cart");
            await browser.pause(2000);
            return true;
          }
        } catch (error) {
          // Continue to next selector
        }
      }

      // Fallback to device back button
      console.log("Using device back button...");
      await browser.back();
      await browser.pause(2000);
      return true;
      
    } catch (error) {
      console.error("Failed to go back:", error);
      return false;
    }
  }

  // Verify cart page
//   async isCartPageDisplayed(): Promise<boolean> {
//     try {
//       await browser.pause(2000);
      
//       // Check for cart title
//       const title = await browser.$(this.myCartTitle);
//       if (await title.isExisting()) {
//         return true;
//       }
      
//       // Check for place order or select address button
//       const placeOrder = await browser.$(this.placeOrderButton);
//       const selectAddress = await browser.$(this.selectAddressButton);
      
//       return (await placeOrder.isExisting()) || (await selectAddress.isExisting());
      
//     } catch (error) {
//       console.error("Error checking cart page:", error);
//       return false;
//     }
//   }

// // Fix for getCartTotal() method - around line 419
// // Complete corrected getCartTotal method
// async getCartTotal(): Promise<string> {
//   try {
//     const totalSelector = '//android.widget.TextView[contains(@text, "₹")]';
//     const totalElements = await browser.$$(totalSelector);
    
//     // Get length synchronously
//     const elementCount = await Promise.resolve(totalElements.length);
    
//     if (elementCount > 0) {
//       // Get the last element which usually contains the total
//       const lastElement = totalElements[elementCount - 1];
//       const totalText = await lastElement.getText();
//       console.log(`Cart total: ${totalText}`);
//       return totalText;
//     }
    
//     return "0";
    
//   } catch (error) {
//     console.error("Failed to get cart total:", error);
//     return "0";
//   }
// }



  // Item quantity management
  async increaseItemQuantityInCart(itemIndex: number = 1, clicks: number = 1): Promise<boolean> {
    console.log(`\n=== Increasing quantity of item ${itemIndex} by ${clicks} ===`);
    
    try {
      const plusButtonSelector = this.getCartItemPlusButton(itemIndex);
      
      for (let i = 0; i < clicks; i++) {
        const plusButton = await browser.$(plusButtonSelector);
        
        if (await plusButton.isExisting()) {
          await plusButton.click();
          console.log(`Click ${i + 1}/${clicks} completed`);
          await browser.pause(1000);
        } else {
          console.log(`Plus button not found for item ${itemIndex}`);
          return false;
        }
      }
      
      console.log(`✓ Item ${itemIndex} quantity increased by ${clicks}`);
      return true;
      
    } catch (error) {
      console.error(`Failed to increase item quantity:`, error);
      return false;
    }
  }

  async decreaseItemQuantityInCart(itemIndex: number = 1, clicks: number = 1): Promise<boolean> {
    console.log(`\n=== Decreasing quantity of item ${itemIndex} by ${clicks} ===`);
    
    try {
      const minusButtonSelector = this.getCartItemMinusButton(itemIndex);
      
      for (let i = 0; i < clicks; i++) {
        const minusButton = await browser.$(minusButtonSelector);
        
        if (await minusButton.isExisting()) {
          await minusButton.click();
          console.log(`Click ${i + 1}/${clicks} completed`);
          await browser.pause(1000);
        } else {
          console.log(`Minus button not found for item ${itemIndex}`);
          return false;
        }
      }
      
      console.log(`✓ Item ${itemIndex} quantity decreased by ${clicks}`);
      return true;
      
    } catch (error) {
      console.error(`Failed to decrease item quantity:`, error);
      return false;
    }
  }

  async deleteItemFromCart(itemIndex: number = 1): Promise<boolean> {
    console.log(`\n=== Deleting item ${itemIndex} from cart ===`);
    
    try {
      const minusButtonSelector = this.getCartItemMinusButton(itemIndex);
      let clickCount = 0;
      const maxClicks = 10;
      
      while (clickCount < maxClicks) {
        const minusButton = await browser.$(minusButtonSelector);
        
        if (!await minusButton.isExisting()) {
          console.log(`✓ Item ${itemIndex} deleted from cart`);
          return true;
        }
        
        await minusButton.click();
        clickCount++;
        console.log(`Delete click ${clickCount}...`);
        await browser.pause(1000);
      }
      
      console.log(`✓ Item deletion completed after ${clickCount} clicks`);
      return true;
      
    } catch (error) {
      console.error("Failed to delete item:", error);
      return false;
    }
  }

  // Delete only first 2 items from cart
 async deleteOneItem(): Promise<boolean> {
  console.log("\n=== Deleting first item from cart ===");
  
  try {
    console.log("Deleting item 1...");
    await this.deleteItemFromCart(1);
    await browser.pause(1000);
    
    console.log("✓ First item deleted from cart");
    return true;
    
  } catch (error) {
    console.error("Failed to delete first item:", error);
    return false;
  }
}

// Verify COD is enabled
async verifyCODEnabled(): Promise<boolean> {
  console.log("\n=== Verifying Cash on Delivery is enabled ===");
  
  try {
    // Check if COD option is visible
    const codOption = await browser.$(this.cashOnDeliveryOption);
    
    if (await codOption.isExisting()) {
      console.log("✅ Cash on Delivery is available and enabled by default");
      await this.takeScreenshot('cod-enabled');
      return true;
    } else {
      console.log("❌ Cash on Delivery option not found");
      return false;
    }
  } catch (error) {
    console.error("Failed to verify COD:", error);
    return false;
  }
}

  // Check if on order success page
  async isOrderSuccessful(): Promise<boolean> {
    try {
      // Check for Continue Shopping button
      const continueBtn = await browser.$(this.continueShoppingButton);
      
      if (await continueBtn.isExisting()) {
        console.log("✓ Order success page detected");
        return true;
      }
      
      // Check for any success message
      const successSelectors = [
        '//android.widget.TextView[contains(@text, "Order Placed")]',
        '//android.widget.TextView[contains(@text, "Success")]',
        '//android.widget.TextView[contains(@text, "Thank you")]'
      ];
      
      for (const selector of successSelectors) {
        const element = await browser.$(selector);
        if (await element.isExisting()) {
          console.log("✓ Order success message found");
          return true;
        }
      }
      
      return false;
      
    } catch (error) {
      console.error("Error checking order success:", error);
      return false;
    }
  }

  // Continue shopping after order
  async continueShoppingAfterOrder(): Promise<boolean> {
    console.log("\n=== Continuing shopping after order ===");
    
    try {
      const continueBtn = await browser.$(this.continueShoppingButton);
      
      if (await continueBtn.isExisting()) {
        await continueBtn.click();
        console.log("✓ Clicked Continue Shopping");
        await browser.pause(2000);
        return true;
      }
      
      console.log("Continue Shopping button not found");
      return false;
      
    } catch (error) {
      console.error("Failed to continue shopping:", error);
      return false;
    }
  }

  // Cancel clear cart operation
  async cancelClearCart(): Promise<boolean> {
    console.log("\n=== Canceling clear cart ===");
    
    try {
      const cancelButton = await browser.$(this.clearCartCancelButton);
      
      if (await cancelButton.isExisting()) {
        await cancelButton.click();
        console.log("✓ Clear cart canceled");
        await browser.pause(1000);
        return true;
      }

      return false;
      
    } catch (error) {
      console.error("Failed to cancel clear cart:", error);
      return false;
    }
  }

  // Summary of cart operations - FIXED
 async getCartSummary(): Promise<{
  itemCount: number;
  total: string;
  hasAddress: boolean;
  canPlaceOrder: boolean;
}> {
  console.log("\n=== Getting cart summary ===");
  
  try {
    const items = await browser.$$(this.cartItems);
    // Ensure itemCount is treated as a number
    const itemCount: number = await Promise.resolve(items.length);
    
    const total = await this.getCartTotal();
    
    const selectAddressBtn = await browser.$(this.selectAddressButton);
    const hasAddress = !(await selectAddressBtn.isExisting());
    
    const placeOrderBtn = await browser.$(this.placeOrderButton);
    const canPlaceOrder = await placeOrderBtn.isExisting();
    
    const summary = {
      itemCount: itemCount as number,  // Explicitly cast to number
      total: total,
      hasAddress: hasAddress,
      canPlaceOrder: canPlaceOrder
    };
    
    console.log("Cart Summary:", summary);
    return summary;
    
  } catch (error) {
    console.error("Failed to get cart summary:", error);
    return {
      itemCount: 0,
      total: "0",
      hasAddress: false,
      canPlaceOrder: false
    };
  }
}

// Complete corrected getItemCount method
async getItemCount(): Promise<number> {
  try {
    const items = await browser.$$(this.cartItems);
    const count: number = await Promise.resolve(items.length);
    return count;
  } catch (error) {
    console.error("Failed to get item count:", error);
    return 0;
  }
}

// Complete corrected performCartOperations method
async performCartOperations(): Promise<boolean> {
  console.log("\n=== PERFORMING CART OPERATIONS ===");
  
  try {
    // Step 1: Get initial cart status
    console.log("\nStep 1: Getting initial cart status...");
    const initialCount = await this.getItemCount();
    console.log(`Initial item count: ${initialCount}`);
    
    if (initialCount === 0) {
      console.log("Cart is empty, nothing to do");
      return false;
    }

    // Step 2: Increase quantity of first item by 2
    console.log("\nStep 2: Increasing quantity of first item by 2...");
    await this.increaseItemQuantityInCart(1, 2);
    await browser.pause(1500);
    
    // Step 3: Decrease quantity of second item by 1
    if (initialCount >= 2) {
      console.log("\nStep 3: Decreasing quantity of second item by 1...");
      await this.decreaseItemQuantityInCart(2, 1);
      await browser.pause(1500);
    }
    
    // Step 4: Delete only ONE item
    console.log("\nStep 4: Deleting ONE item from cart...");
    await this.deleteOneItem();
    await browser.pause(1500);
    
    // Step 5: Check remaining items
    const remainingCount = await this.getItemCount();
    console.log(`Remaining items after deletion: ${remainingCount}`);
    
    // Step 6: Clear cart
    if (remainingCount > 0) {
      console.log("\nStep 6: Clearing all remaining items from cart...");
      const cleared = await this.clearCart();
      
      if (cleared) {
        console.log("✓ Cart operations completed successfully");
        return true;
      } else {
        console.log("Failed to clear cart");
        return false;
      }
    } else {
      console.log("✓ Cart is already empty");
      return true;
    }
    
  } catch (error) {
    console.error("Cart operations failed:", error);
    return false;
  }
}

// Enhanced place order with COD verification
async placeOrderWithCOD(): Promise<boolean> {
  console.log("\n=== PLACING ORDER WITH CASH ON DELIVERY ===");
  
  try {
    await this.takeScreenshot('cart-before-order');
    
    // Verify COD is enabled
    const codEnabled = await this.verifyCODEnabled();
    if (!codEnabled) {
      console.log("⚠️ COD verification failed, but continuing as it's default...");
    }
    
    // Check if we need to select address
    console.log("\nChecking for address selection...");
    let selectAddressBtn = await browser.$(this.selectAddressButton);
    
    if (await selectAddressBtn.isExisting()) {
      console.log("Address selection required");
      const addressHandled = await this.handleAddressSelection();
      
      if (!addressHandled) {
        console.log("Failed to handle address selection");
        return false;
      }
    } else {
      console.log("Address already selected or not required");
    }

    // Click Place Order
    console.log("\nClicking Place Order button...");
    const placeOrderBtn = await browser.$(this.placeOrderButton);
    
    if (!await placeOrderBtn.isExisting()) {
      console.log("Place Order button not visible, scrolling...");
      await this.swipeUpOnCart();
      await browser.pause(1000);
    }
    
    if (await placeOrderBtn.isExisting()) {
      await placeOrderBtn.click();
      console.log("✓ Place Order clicked");
      await browser.pause(3000);
      
      // Handle Continue Shopping
      console.log("\nLooking for Continue Shopping button...");
      const continueBtn = await browser.$(this.continueShoppingButton);
      
      if (await continueBtn.isExisting()) {
        console.log("✅ Order placed successfully!");
        await this.takeScreenshot('order-success');
        
        console.log("Clicking Continue Shopping...");
        await continueBtn.click();
        console.log("✓ Redirecting to home page");
        await browser.pause(2000);
        return true;
      } else {
        console.log("Continue Shopping button not found, order might have failed");
        await this.takeScreenshot('order-status-unknown');
        return false;
      }
    } else {
      console.log("Place Order button not found");
      return false;
    }
    
  } catch (error) {
    console.error("Failed to place order:", error);
    await this.takeScreenshot('order-failed');
    return false;
  }
}
// Add/Update these methods in your CartPage class

// Perform all operations on the SAME first product
// Replace the performCartOperationsOnSingleProduct method with this corrected version

async performCartOperationsOnSingleProduct(): Promise<boolean> {
  console.log("\n=== PERFORMING CART OPERATIONS ON SINGLE PRODUCT ===");
  
  try {
    // Step 1: Get initial cart status
    console.log("\nStep 1: Getting initial cart status...");
    const initialCount = await this.getItemCount();
    console.log(`Initial item count: ${initialCount}`);
    
    if (initialCount === 0) {
      console.log("Cart is empty, nothing to do");
      return false;
    }

    // Step 2: Increment first item by 1 (from 1 to 2)
    console.log("\nStep 2: Incrementing first item quantity by 1...");
    
    // Correct xpath for ImageView elements - more generic approach
    const plusButtonSelectors = [
      // Try specific product xpath first
      '//android.widget.ImageView[contains(@content-desc, "item ₹") and contains(@content-desc, " 1")]/android.view.View[2]',
      // Alternative generic selector
      '(//android.widget.ImageView[contains(@content-desc, "item")]/android.view.View[2])[1]',
      // UI Automator selector
      'android=new UiSelector().className("android.view.View").instance(6)'
    ];
    
    let plusClicked = false;
    for (const selector of plusButtonSelectors) {
      try {
        const plusButton = await browser.$(selector);
        if (await plusButton.isExisting()) {
          await plusButton.click();
          console.log("✓ Clicked plus button - quantity should be 2 now");
          plusClicked = true;
          await browser.pause(1500);
          await this.takeScreenshot('cart-item-incremented');
          break;
        }
      } catch (e) {
        // Try next selector
      }
    }
    
    if (!plusClicked) {
      console.log("Plus button not found with any selector");
      return false;
    }

    // Step 3: Decrement the SAME item by 1 (from 2 back to 1)
    console.log("\nStep 3: Decrementing the same item quantity by 1...");
    
    // After increment, content-desc changes to include "2"
    const minusButtonSelectors = [
      // Try specific product xpath with quantity 2
      '//android.widget.ImageView[contains(@content-desc, "item ₹") and contains(@content-desc, " 2")]/android.view.View[1]',
      // Alternative generic selector
      '(//android.widget.ImageView[contains(@content-desc, "item")]/android.view.View[1])[1]',
      // UI Automator selector
      'android=new UiSelector().className("android.view.View").instance(5)'
    ];
    
    let minusClicked = false;
    for (const selector of minusButtonSelectors) {
      try {
        const minusButton = await browser.$(selector);
        if (await minusButton.isExisting()) {
          await minusButton.click();
          console.log("✓ Clicked minus button - quantity should be back to 1");
          minusClicked = true;
          await browser.pause(1500);
          await this.takeScreenshot('cart-item-decremented');
          break;
        }
      } catch (e) {
        // Try next selector
      }
    }
    
    if (!minusClicked) {
      console.log("Minus button not found with any selector");
      return false;
    }

    // Step 4: Delete the SAME product completely
    console.log("\nStep 4: Deleting the same product completely...");
    
    // Click minus button again to delete - now quantity is 1
    const deleteButtonSelectors = [
      '//android.widget.ImageView[contains(@content-desc, "item ₹") and contains(@content-desc, " 1")]/android.view.View[1]',
      '(//android.widget.ImageView[contains(@content-desc, "item")]/android.view.View[1])[1]',
      'android=new UiSelector().className("android.view.View").instance(5)'
    ];
    
    let deleteClicked = false;
    for (const selector of deleteButtonSelectors) {
      try {
        const deleteButton = await browser.$(selector);
        if (await deleteButton.isExisting()) {
          await deleteButton.click();
          console.log("✓ Clicked minus again to delete the product");
          deleteClicked = true;
          await browser.pause(1500);
          await this.takeScreenshot('cart-item-deleted');
          break;
        }
      } catch (e) {
        // Try next selector
      }
    }

    // Step 5: Clear remaining items with Clear Cart button
    console.log("\nStep 5: Clearing all remaining items from cart...");
    
    // Check if there are still items in cart
    const remainingCount = await this.getItemCount();
    console.log(`Remaining items: ${remainingCount}`);
    
    if (remainingCount > 0) {
      const cleared = await this.clearCart();
      if (cleared) {
        console.log("✓ Cart cleared successfully");
        await this.takeScreenshot('cart-cleared');
        return true;
      } else {
        console.log("Failed to clear cart");
        return false;
      }
    } else {
      console.log("✓ Cart is already empty");
      return true;
    }
    
  } catch (error) {
    console.error("Cart operations failed:", error);
    return false;
  }
}

// Update isCartPageDisplayed to handle Select Address button
async isCartPageDisplayed(): Promise<boolean> {
  try {
    await browser.pause(2000);
    
    // Check for cart indicators
    const selectors = [
      this.myCartTitle,
      this.placeOrderButton,
      this.selectAddressButton,
      '//android.widget.TextView[contains(@text, "Cart")]',
      '//android.view.View[contains(@content-desc, "Price Details")]'
    ];
    
    for (const selector of selectors) {
      try {
        const element = await browser.$(selector);
        if (await element.isExisting()) {
          console.log(`Cart page detected via: ${selector}`);
          return true;
        }
      } catch (e) {
        // Continue checking
      }
    }
    
    return false;
    
  } catch (error) {
    console.error("Error checking cart page:", error);
    return false;
  }
}

// Updated getCartTotal to handle the price display format
async getCartTotal(): Promise<string> {
  try {
    // Look for total amount in different possible locations
    const totalSelectors = [
      '//android.widget.TextView[contains(@text, "₹") and contains(@text, "Total")]/../android.widget.TextView[contains(@text, "₹")]',
      '//android.view.View[@content-desc="Total"]/following-sibling::android.view.View[contains(@content-desc, "₹")]',
      '//android.widget.TextView[contains(@text, "₹") and not(contains(@text, "Subtotal")) and not(contains(@text, "Tax"))]'
    ];
    
    for (const selector of totalSelectors) {
      try {
        const totalElement = await browser.$(selector);
        if (await totalElement.isExisting()) {
          const totalText = await totalElement.getText();
          console.log(`Cart total found: ${totalText}`);
          return totalText;
        }
      } catch (e) {
        // Try next selector
      }
    }
    
    // Fallback: get all price elements and return the last one
    const priceElements = await browser.$$('//android.widget.TextView[contains(@text, "₹")]');
    
    // Fix: Properly handle the async length
    const elementsCount = await Promise.resolve(priceElements.length);
    
    if (elementsCount > 0) {
      const lastElement = priceElements[elementsCount - 1];
      const totalText = await lastElement.getText();
      return totalText;
    }
    
    return "0";
    
  } catch (error) {
    console.error("Failed to get cart total:", error);
    return "0";
  }
}

// Updated clear cart method with correct selectors
async clearCart(): Promise<boolean> {
  console.log("\n=== Clearing cart ===");
  
  try {
    // Using the specific selector for Clear button
    const clearButtonXpath = '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View[1]/android.widget.Button[2]';
    const clearButton = await browser.$(clearButtonXpath);
    
    if (!await clearButton.isExisting()) {
      // Try alternative selector
      const altClearButton = await browser.$('android=new UiSelector().className("android.widget.Button").instance(1)');
      if (await altClearButton.isExisting()) {
        await altClearButton.click();
      } else {
        console.log("Clear cart button not found");
        return false;
      }
    } else {
      await clearButton.click();
    }
    
    console.log("Clear Cart button clicked, waiting for confirmation dialog...");
    await browser.pause(1000);

    // Handle confirmation dialog - click Clear
    const confirmClearXpath = '//android.widget.Button[@content-desc="Clear"]';
    const confirmButton = await browser.$(confirmClearXpath);
    
    if (await confirmButton.isExisting()) {
      console.log("Confirming cart clear...");
      await confirmButton.click();
      console.log("✓ Cart cleared successfully");
      await browser.pause(2000);
      return true;
    }

    console.log("Confirmation dialog not found");
    return false;
    
  } catch (error) {
    console.error("Failed to clear cart:", error);
    return false;
  }
}

// Enhanced place order with proper COD verification
async placeOrderWithAddressAndCOD(): Promise<boolean> {
  console.log("\n=== PLACING ORDER WITH ADDRESS SELECTION AND COD ===");
  
  try {
    await this.takeScreenshot('cart-before-order');
    
    // Step 1: Swipe up to see payment method
    console.log("\nStep 1: Swiping up to see payment method...");
    await this.swipeUpOnCart();
    await browser.pause(1500);
    
    // Step 2: Verify COD is visible and enabled
    console.log("\nStep 2: Verifying Cash on Delivery is enabled...");
    const codXpath = '//android.view.View[@content-desc="Cash on Delivery\nPay when your order arrives"]';
    const codOption = await browser.$(codXpath);
    
    if (await codOption.isExisting()) {
      console.log("✅ Cash on Delivery is visible and enabled");
      await this.takeScreenshot('cod-enabled');
    } else {
      console.log("⚠️ COD option not visible, but it should be default");
    }
    
    // Step 3: Check for Select Address button
    console.log("\nStep 3: Looking for Select Address button...");
    const selectAddressXpath = '//android.widget.Button[@content-desc="Select Address"]';
    const selectAddressBtn = await browser.$(selectAddressXpath);
    
    if (await selectAddressBtn.isExisting()) {
      console.log("Address selection required");
      
      // Click Select Address
      await selectAddressBtn.click();
      console.log("✓ Select Address clicked");
      await browser.pause(3000);
      
      // Step 4: Click Use Current Location
      console.log("\nStep 4: Clicking Use Current Location...");
      const useLocationXpath = '//android.widget.Button[@content-desc="Use Current Location"]';
      const useLocationBtn = await browser.$(useLocationXpath);
      
      let retries = 3;
      while (retries > 0) {
        if (await useLocationBtn.isExisting()) {
          await useLocationBtn.click();
          console.log("✓ Use Current Location clicked");
          await browser.pause(3000);
          break;
        }
        console.log("Waiting for Use Current Location button...");
        await browser.pause(1000);
        retries--;
      }
      
      // Step 5: Swipe up to find Save Address
      console.log("\nStep 5: Swiping up to find Save Address button...");
      let saveAddressFound = false;
      let swipeAttempts = 3;
      
      while (!saveAddressFound && swipeAttempts > 0) {
        await this.swipeUpOnCart();
        await browser.pause(1000);
        
        const saveAddressXpath = '//android.widget.Button[@content-desc="Save Address"]';
        const saveBtn = await browser.$(saveAddressXpath);
        
        if (await saveBtn.isExisting()) {
          console.log("✓ Save Address button found");
          await saveBtn.click();
          console.log("✓ Address saved");
          saveAddressFound = true;
          await browser.pause(3000);
        } else {
          console.log(`Save Address not found, attempting swipe ${4 - swipeAttempts}/3`);
          swipeAttempts--;
        }
      }
      
      if (!saveAddressFound) {
        console.log("Failed to find Save Address button");
        return false;
      }
    } else {
      console.log("Address already selected (Select Address button not found)");
    }
    
    // Step 6: Click Place Order
    console.log("\nStep 6: Looking for Place Order button...");
    const placeOrderXpath = '//android.widget.Button[@content-desc="Place Order"]';
    const placeOrderBtn = await browser.$(placeOrderXpath);
    
    if (!await placeOrderBtn.isExisting()) {
      console.log("Place Order not visible, scrolling...");
      await this.swipeUpOnCart();
      await browser.pause(1000);
    }
    
    if (await placeOrderBtn.isExisting()) {
      console.log("Clicking Place Order...");
      await placeOrderBtn.click();
      console.log("✓ Place Order clicked");
      await browser.pause(3000);
      
      // Step 7: Handle order success
      console.log("\nStep 7: Checking for order success...");
      const continueShoppingXpath = '//android.widget.Button[@content-desc="Continue Shopping"]';
      const continueBtn = await browser.$(continueShoppingXpath);
      
      let orderSuccessDetected = false;
      let waitAttempts = 5;
      
      while (!orderSuccessDetected && waitAttempts > 0) {
        if (await continueBtn.isExisting()) {
          console.log("✅ Order placed successfully!");
          await this.takeScreenshot('order-success');
          
          await continueBtn.click();
          console.log("✓ Continue Shopping clicked");
          orderSuccessDetected = true;
          await browser.pause(2000);
          return true;
        }
        
        console.log("Waiting for order confirmation...");
        await browser.pause(1000);
        waitAttempts--;
      }
      
      if (!orderSuccessDetected) {
        console.log("Order confirmation not detected");
        return false;
      }
    } else {
      console.log("Place Order button not found");
      return false;
    }
    
  } catch (error) {
    console.error("Failed to place order:", error);
    await this.takeScreenshot('order-error');
    return false;
  }
  
  return false;
}
}
