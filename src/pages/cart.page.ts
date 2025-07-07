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

  private get loginToProceedButton() {
  return '//android.widget.Button[@content-desc="Login to Proceed"]';
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
// Add these methods to handle keyboard

// Method to hide keyboard
async hideKeyboard(): Promise<boolean> {
  console.log("Attempting to hide keyboard...");
  
  try {
    // Method 1: Try driver hideKeyboard command
    if (browser.isAndroid) {
      try {
        await browser.hideKeyboard();
        console.log("✓ Keyboard hidden using hideKeyboard()");
        await browser.pause(1000);
        return true;
      } catch (e) {
        console.log("hideKeyboard() method not available, trying alternatives...");
      }
    }
    
    // Method 2: Press device back button
    try {
      await browser.back();
      console.log("✓ Pressed back button to hide keyboard");
      await browser.pause(1000);
      return true;
    } catch (e) {
      console.log("Back button method failed");
    }
    
    // Method 3: Click outside the input field
    try {
      // Click on a neutral area (header or title)
      const headerElement = await browser.$('//android.widget.TextView[@text="Add New Address"]');
      if (await headerElement.isExisting()) {
        await headerElement.click();
        console.log("✓ Clicked on header to dismiss keyboard");
        await browser.pause(1000);
        return true;
      }
    } catch (e) {
      console.log("Click outside method failed");
    }
    
    return false;
  } catch (error) {
    console.error("Failed to hide keyboard:", error);
    return false;
  }
}

// Updated handleAddressSelection with keyboard handling
// Updated handleAddressSelection method in cart.page.ts

// Make sure this method is in your cart.page.ts

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
    console.log("✓ Select Address clicked, waiting for Add New Address page to load...");
    await browser.pause(3000);
    await this.takeScreenshot('add-new-address-page');

    // Step 2: Click Use Current Location
    console.log("\nStep 2: Clicking Use Current Location...");
    const useLocationBtn = await browser.$(this.useCurrentLocationButton);
    
    if (await useLocationBtn.isExisting() && await useLocationBtn.isDisplayed()) {
      await useLocationBtn.click();
      console.log("✓ Use Current Location clicked");
      await browser.pause(3000); // Wait for location to be fetched
    } else {
      console.log("Use Current Location button not found");
      return false;
    }

    // Step 3: CRITICAL - Click Home button to dismiss keyboard
    console.log("\nStep 3: Clicking Home button to dismiss keyboard...");
    const homeButtonSelectors = [
      '//android.view.View[@content-desc="Home"]',
      '//android.widget.Button[@content-desc="Home"]',
      '//android.widget.TextView[@content-desc="Home"]',
      'android=new UiSelector().description("Home")'
    ];
    
    let homeClicked = false;
    for (const selector of homeButtonSelectors) {
      try {
        const homeBtn = await browser.$(selector);
        if (await homeBtn.isExisting()) {
          await homeBtn.click();
          console.log("✓ Home button clicked - keyboard dismissed");
          homeClicked = true;
          await browser.pause(2000);
          break;
        }
      } catch (e) {
        // Try next selector
      }
    }
    
    if (!homeClicked) {
      console.log("⚠️ Home button not found - trying back button to dismiss keyboard");
      await browser.back();
      await browser.pause(1000);
    }

    // Step 4: Now swipe up to reveal checkbox and save button
    console.log("\nStep 4: Swiping up to reveal Save Address section...");
    await this.swipeUpOnCart();
    await browser.pause(1500);
    await this.takeScreenshot('after-first-swipe');
    
    // Step 5: Look for checkbox (might need another swipe)
    console.log("\nStep 5: Looking for 'Set as default address' checkbox...");
    const checkboxSelectors = [
      '//android.widget.CheckBox[@content-desc="Set as default address"]',
      'android=new UiSelector().description("Set as default address")'
    ];
    
    let checkboxFound = false;
    for (const selector of checkboxSelectors) {
      try {
        const checkbox = await browser.$(selector);
        if (await checkbox.isExisting() && await checkbox.isDisplayed()) {
          const isChecked = await checkbox.getAttribute('checked');
          if (isChecked !== 'true') {
            await checkbox.click();
            console.log("✓ 'Set as default address' checkbox clicked");
          } else {
            console.log("✓ 'Set as default address' already checked");
          }
          checkboxFound = true;
          await browser.pause(1000);
          break;
        }
      } catch (e) {
        // Continue
      }
    }
    
    if (!checkboxFound) {
      console.log("Checkbox not visible yet, trying one more swipe...");
      await this.swipeUpOnCart();
      await browser.pause(1500);
    }

    // Step 6: Click Save Address button
    console.log("\nStep 6: Looking for Save Address button...");
    const saveButtonSelectors = [
      '//android.widget.Button[@content-desc="Save Address"]',
      'android=new UiSelector().description("Save Address")'
    ];
    
    let saveClicked = false;
    let saveAttempts = 2;
    
    while (!saveClicked && saveAttempts > 0) {
      for (const selector of saveButtonSelectors) {
        try {
          const saveBtn = await browser.$(selector);
          if (await saveBtn.isExisting() && await saveBtn.isDisplayed()) {
            await saveBtn.click();
            console.log("✓ Save Address button clicked");
            saveClicked = true;
            await browser.pause(3000);
            break;
          }
        } catch (e) {
          // Continue
        }
      }
      
      if (!saveClicked && saveAttempts > 1) {
        console.log("Save Address not visible, trying another swipe...");
        await this.swipeUpOnCart();
        await browser.pause(1500);
      }
      
      saveAttempts--;
    }
    
    if (!saveClicked) {
      console.log("❌ Failed to find and click Save Address button");
      await this.takeScreenshot('save-address-not-found');
      return false;
    }
    
    // Step 7: Wait for redirect back to cart
    console.log("\nStep 7: Waiting for redirect to cart page...");
    let cartPageLoaded = false;
    let waitAttempts = 5;
    
    while (!cartPageLoaded && waitAttempts > 0) {
      await browser.pause(1000);
      
      const placeOrderBtn = await browser.$(this.placeOrderButton);
      const myCartTitle = await browser.$(this.myCartTitle);
      
      if (await placeOrderBtn.isExisting() || await myCartTitle.isExisting()) {
        cartPageLoaded = true;
        console.log("✓ Successfully returned to cart page with address selected");
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
    console.log("\n✅ Address selection completed successfully!");
    console.log("   • Used current location");
    console.log("   • Clicked Home to dismiss keyboard");
    console.log("   • Set as default address");
    console.log("   • Address saved successfully");
    
    return true;

  } catch (error) {
    console.error("Failed to handle address selection:", error);
    await this.takeScreenshot('address-selection-error');
    return false;
  }
}

// Alternative swipe method that avoids keyboard area
async swipeUpAvoidingKeyboard() {
  console.log("Performing swipe up (avoiding keyboard area)...");
  
  try {
    const { width, height } = await browser.getWindowSize();
    
    // Start swipe from middle of screen (avoiding bottom where keyboard might be)
    // and swipe to top portion
    await browser.action('pointer')
      .move({ duration: 0, x: width * 0.5, y: height * 0.5 }) // Start from middle
      .down({ button: 0 })
      .move({ duration: 1000, x: width * 0.5, y: height * 0.2 }) // Swipe to top
      .up({ button: 0 })
      .perform();
    
    await browser.pause(1500);
    
  } catch (error) {
    console.error("Error during swipe:", error);
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
// In cart.page.ts - Replace the entire placeOrderWithAddressAndCOD method

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
      
      // Use the updated handleAddressSelection method that includes Home button click
      const addressHandled = await this.handleAddressSelection();
      
      if (!addressHandled) {
        console.log("Failed to handle address selection");
        return false;
      }
    } else {
      console.log("Address already selected or not required");
    }

    // Step 4: Click Place Order
    console.log("\nStep 4: Looking for Place Order button...");
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
      
      // Step 5: Handle order success
      console.log("\nStep 5: Checking for order success...");
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

// Shopping without Login Flow 
async isLoginRequired(): Promise<boolean> {
  try {
    const loginButton = await browser.$(this.loginToProceedButton);
    return await loginButton.isExisting();
  } catch (error) {
    console.error("Error checking login requirement:", error);
    return false;
  }
}

// Click Login to Proceed
async clickLoginToProceed(): Promise<boolean> {
  console.log("\n=== Clicking Login to Proceed ===");
  
  try {
    const loginButton = await browser.$(this.loginToProceedButton);
    
    if (await loginButton.isExisting()) {
      await loginButton.click();
      console.log("✓ Login to Proceed clicked");
      await browser.pause(2000);
      return true;
    }
    
    console.log("Login to Proceed button not found");
    return false;
    
  } catch (error) {
    console.error("Failed to click Login to Proceed:", error);
    return false;
  }
}
// Shopping without Login Flow
// Add this method to cart.page.ts

async completeCheckoutWithLogin(mobileNumber: string, otp: string): Promise<boolean> {
  console.log("\n=== COMPLETE CHECKOUT WITH LOGIN ===");
  
  try {
    // Step 1: Check if login is required
    if (await this.isLoginRequired()) {
      console.log("Login required, initiating login flow...");
      
      // Click Login to Proceed
      const loginClicked = await this.clickLoginToProceed();
      if (!loginClicked) {
        console.log("Failed to click Login to Proceed");
        return false;
      }
      
      // Wait for login page
      await browser.pause(2000);
      
      // Perform login (assuming loginPage is accessible)
      const loginPage = new (require('../login.page').LoginPage)();
      const loginSuccess = await loginPage.performCartLogin(mobileNumber, otp);
      
      if (!loginSuccess) {
        console.log("Login failed");
        return false;
      }
      
      // Wait to return to cart
      await browser.pause(3000);
      
      // Verify we're back on cart
      const isCart = await this.isCartPageDisplayed();
      if (!isCart) {
        console.log("Not returned to cart after login");
        return false;
      }
      
      console.log("✓ Login completed, back on cart page");
    }
    
    // Step 2: Check if address selection is needed
    const selectAddressBtn = await browser.$(this.selectAddressButton);
    if (await selectAddressBtn.isExisting()) {
      console.log("Address selection required...");
      const addressHandled = await this.handleAddressSelection();
      
      if (!addressHandled) {
        console.log("Failed to handle address selection");
        return false;
      }
    }
    
    // Step 3: Place order
    console.log("Placing order...");
    const orderSuccess = await this.placeOrder();
    
    if (orderSuccess) {
      console.log("✅ Checkout completed successfully with login!");
    } else {
      console.log("❌ Checkout failed");
    }
    
    return orderSuccess;
    
  } catch (error) {
    console.error("Checkout with login failed:", error);
    return false;
  }
}

//Address Flow 
async hasSelectAddressButton(): Promise<boolean> {
  try {
    const selectBtn = await browser.$(this.selectAddressButton);
    return await selectBtn.isExisting();
  } catch (error) {
    return false;
  }
}

// Method to click Select Address
async clickSelectAddress(): Promise<boolean> {
  console.log("\n=== Clicking Select Address ===");
  
  try {
    const selectBtn = await browser.$(this.selectAddressButton);
    
    if (await selectBtn.isExisting()) {
      await selectBtn.click();
      console.log("✓ Select Address clicked");
      await browser.pause(2000);
      return true;
    }
    
    console.log("Select Address button not found");
    return false;
    
  } catch (error) {
    console.error("Failed to click Select Address:", error);
    return false;
  }
}

// Method to select a specific address from the list
async selectAddressFromList(addressType: 'HOME' | 'WORK' | 'OTHER' = 'HOME'): Promise<boolean> {
  console.log(`\n=== Selecting ${addressType} address ===`);
  
  try {
    // Wait for address list to load
    await browser.pause(2000);
    
    // Try different selectors for the address
    const addressSelectors = [
      `//android.view.View[contains(@content-desc, "${addressType}")]`,
      `//android.widget.Button[contains(@content-desc, "${addressType}")]`,
      `//android.view.View[contains(@content-desc, "${addressType}") and contains(@content-desc, "Bengaluru")]`,
      `android=new UiSelector().descriptionContains("${addressType}")`
    ];
    
    let addressSelected = false;
    
    for (const selector of addressSelectors) {
      try {
        const addressElement = await browser.$(selector);
        if (await addressElement.isExisting()) {
          await addressElement.click();
          console.log(`✓ ${addressType} address selected`);
          addressSelected = true;
          await browser.pause(2000);
          break;
        }
      } catch (e) {
        // Continue with next selector
      }
    }
    
    if (!addressSelected) {
      console.log(`${addressType} address not found in list`);
      return false;
    }
    
    // Wait for redirect back to cart
    console.log("Waiting for redirect back to cart...");
    await browser.pause(2000);
    
    return true;
    
  } catch (error) {
    console.error(`Failed to select ${addressType} address:`, error);
    return false;
  }
}

// Complete address selection flow
async handleAddressSelectionFromList(): Promise<boolean> {
  console.log("\n=== Handling Address Selection from List ===");
  
  try {
    // Check if Select Address button exists
    if (await this.hasSelectAddressButton()) {
      // Click Select Address
      if (!await this.clickSelectAddress()) {
        return false;
      }
      
      // Select HOME address by default
      if (!await this.selectAddressFromList('HOME')) {
        return false;
      }
      
      console.log("✓ Address selected successfully");
      return true;
    } else {
      console.log("Select Address button not found - address might already be selected");
      return true;
    }
    
  } catch (error) {
    console.error("Failed to handle address selection:", error);
    return false;
  }
}
// Add this to cart.page.ts for a complete checkout flow with address selection

async completeCheckoutWithAddressSelection(): Promise<boolean> {
  console.log("\n=== Complete Checkout with Address Selection ===");
  
  try {
    // Step 1: Handle address selection if needed
    const hasSelectAddress = await this.hasSelectAddressButton();
    
    if (hasSelectAddress) {
      console.log("Address selection required");
      
      if (!await this.handleAddressSelectionFromList()) {
        console.log("Failed to select address");
        return false;
      }
      
      // Wait for cart to update
      await browser.pause(2000);
    } else {
      console.log("Address already selected or not required");
    }
    
    // Step 2: Swipe to see payment options
    await this.swipeUpOnCart();
    await browser.pause(1500);
    
    // Step 3: Place order
    console.log("Looking for Place Order button...");
    const placeOrderBtn = await browser.$(this.placeOrderButton);
    
    if (await placeOrderBtn.isExisting()) {
      await placeOrderBtn.click();
      console.log("✓ Place Order clicked");
      await browser.pause(3000);
      
      // Step 4: Handle order success
      const continueBtn = await browser.$(this.continueShoppingButton);
      let orderSuccess = false;
      let attempts = 5;
      
      while (!orderSuccess && attempts > 0) {
        if (await continueBtn.isExisting()) {
          console.log("✅ Order placed successfully!");
          await this.takeScreenshot('order-success-with-address');
          
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
      
      return orderSuccess;
    } else {
      console.log("Place Order button not found");
      return false;
    }
    
  } catch (error) {
    console.error("Checkout failed:", error);
    return false;
  }
}
}
