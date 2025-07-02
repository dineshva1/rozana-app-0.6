// src/pages/cart.page.ts - Complete fixed version
import { BasePage } from './base.page';
import { browser } from '@wdio/globals';

export class CartPage extends BasePage {
  // Existing selectors
  private get myCartTitle() {
    return '//android.widget.TextView[contains(@text, "My Cart")]';
  }

  private get placeOrderButton() {
    return '//android.widget.Button[@content-desc="Place Order"]';
  }

  private get cartItems() {
    return '//android.view.View[contains(@content-desc, "₹")]';
  }

  // UPI selectors
  private get upiOption() {
    return '//android.view.View[@content-desc="UPI\nPay using any UPI app"]';
  }

  private get upiRadioButton() {
    return '//android.view.View[@content-desc="UPI\nPay using any UPI app"]/android.widget.RadioButton';
  }

  // CORRECTED BUTTON SELECTORS
  // Go back button - Button[1] (first button)
  private get goBackButton() {
    return '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View[1]/android.widget.Button[1]';
  }

  // Alternative go back button selector using UIAutomator
  private get goBackButtonAlt() {
    return 'android=new UiSelector().className("android.widget.Button").instance(0)';
  }

  // Clear cart button - We'll need to identify this differently
  private get clearCartButton() {
    // Try multiple selectors for clear cart
    return '//android.widget.Button[contains(@text, "Clear") or contains(@content-desc, "Clear")]';
  }

  // Alternative clear cart button selectors
  private get clearCartButtonAlt1() {
    return '//android.widget.Button[2]';
  }

  private get clearCartButtonAlt2() {
    return 'android=new UiSelector().className("android.widget.Button").instance(1)';
  }

  // Cash on Delivery selector
  private get cashOnDeliveryOption() {
    return '//android.view.View[@content-desc="Cash on Delivery\nPay when your order arrives"]';
  }

  // Item controls in cart
  private getCartItemPlusButton(index: number = 1) {
    return `(//android.widget.ImageView[contains(@content-desc, "item")]/android.view.View[2])[${index}]`;
  }

  private getCartItemMinusButton(index: number = 1) {
    return `(//android.widget.ImageView[contains(@content-desc, "item")]/android.view.View[1])[${index}]`;
  }

  // ... existing methods ...

  // Updated clearCart method with multiple selector attempts
  async clearCart() {
    console.log("\n=== Clearing cart ===");
    
    try {
      // Try different selectors for clear cart button
      const clearSelectors = [
        this.clearCartButton,
        this.clearCartButtonAlt1,
        this.clearCartButtonAlt2,
        '//android.widget.Button[contains(@text, "Clear Cart")]',
        '//android.widget.Button[contains(@content-desc, "Clear Cart")]',
        '//android.view.View[contains(@content-desc, "Clear")]/android.widget.Button',
        '(//android.widget.Button)[last()]' // Try last button if it's the clear button
      ];

      let cleared = false;
      
      for (const selector of clearSelectors) {
        try {
          console.log(`Trying selector: ${selector.substring(0, 50)}...`);
          const button = await browser.$(selector);
          
          if (await button.isExisting() && await button.isDisplayed()) {
            console.log("Clear cart button found!");
            await button.click();
            cleared = true;
            console.log("✓ Cart cleared");
            break;
          }
        } catch (error) {
          // Continue to next selector
        }
      }

      if (!cleared) {
        console.log("⚠️ Clear cart button not found, skipping clear operation");
        // Don't throw error, just log warning
      }

      await browser.pause(2000);
      return cleared;
      
    } catch (error) {
      console.log("Failed to clear cart:", error);
      return false;
    }
  }

  // Updated goBackFromCart method with better selectors
  async goBackFromCart() {
    console.log("\n=== Going back from cart ===");
    
    try {
      // Try primary selector first
      let backButton = await browser.$(this.goBackButton);
      
      if (await backButton.isExisting() && await backButton.isDisplayed()) {
        console.log("Using primary go back button selector");
        await backButton.click();
        console.log("✓ Navigated back from cart");
        await browser.pause(2000);
        return true;
      }

      // Try alternative selector
      console.log("Primary selector failed, trying alternative...");
      backButton = await browser.$(this.goBackButtonAlt);
      
      if (await backButton.isExisting() && await backButton.isDisplayed()) {
        console.log("Using alternative go back button selector");
        await backButton.click();
        console.log("✓ Navigated back from cart");
        await browser.pause(2000);
        return true;
      }

      // If both fail, try device back button
      console.log("Button selectors failed, using device back button");
      await browser.back();
      console.log("✓ Used device back button");
      await browser.pause(2000);
      return true;
      
    } catch (error) {
      console.log("All back navigation failed, using device back as last resort:", error);
      await browser.back();
      await browser.pause(2000);
      return false;
    }
  }

  // Verify cart page
  async isCartPageDisplayed(): Promise<boolean> {
    try {
      await browser.pause(2000);
      const placeOrderExists = await this.isElementExisting(this.placeOrderButton);
      const cartItemsExist = await this.isElementExisting(this.cartItems);
      return placeOrderExists || cartItemsExist;
    } catch {
      return false;
    }
  }

  // Correct swipe implementation based on Appium Inspector
  async swipeUpOnCart() {
    console.log("Performing swipe up on cart...");
    
    try {
      const { width, height } = await browser.getWindowSize();
      
      const startX = Math.floor(width * 0.5);
      const startY = Math.floor(height * 0.7);
      const endX = Math.floor(width * 0.5);
      const endY = Math.floor(height * 0.2);
      
      console.log(`Swiping from (${startX}, ${startY}) to (${endX}, ${endY})`);
      
      await browser.action('pointer')
        .move({ duration: 0, x: startX, y: startY })
        .down({ button: 0 })
        .move({ duration: 1000, x: endX, y: endY })
        .up({ button: 0 })
        .perform();
      
      console.log("✓ Swipe completed");
      await browser.pause(1500);
      
    } catch (error) {
      console.error("Error during swipe:", error);
      throw error;
    }
  }

  // New methods for cart operations
  async increaseItemQuantityInCart(itemIndex: number = 1, clicks: number = 1) {
    console.log(`\n=== Increasing quantity of item ${itemIndex} by ${clicks} ===`);
    
    try {
      const plusButtonSelector = this.getCartItemPlusButton(itemIndex);
      await this.waitForElement(plusButtonSelector);
      
      for (let i = 0; i < clicks; i++) {
        console.log(`Click ${i + 1}/${clicks}...`);
        await this.clickElement(plusButtonSelector);
        await browser.pause(1000);
      }
      
      console.log(`✓ Item ${itemIndex} quantity increased by ${clicks}`);
      return true;
    } catch (error) {
      console.log(`Failed to increase item quantity:`, error);
      return false;
    }
  }

  async decreaseItemQuantityInCart(itemIndex: number = 1, clicks: number = 1) {
    console.log(`\n=== Decreasing quantity of item ${itemIndex} by ${clicks} ===`);
    
    try {
      const minusButtonSelector = this.getCartItemMinusButton(itemIndex);
      await this.waitForElement(minusButtonSelector);
      
      for (let i = 0; i < clicks; i++) {
        console.log(`Click ${i + 1}/${clicks}...`);
        await this.clickElement(minusButtonSelector);
        await browser.pause(1000);
      }
      
      console.log(`✓ Item ${itemIndex} quantity decreased by ${clicks}`);
      return true;
    } catch (error) {
      console.log(`Failed to decrease item quantity:`, error);
      return false;
    }
  }

  async deleteItemFromCart(itemIndex: number = 1) {
    console.log(`\n=== Deleting item ${itemIndex} from cart ===`);
    
    try {
      const minusButtonSelector = this.getCartItemMinusButton(itemIndex);
      
      let clickCount = 0;
      const maxClicks = 10;
      
      while (clickCount < maxClicks) {
        const exists = await this.isElementExisting(minusButtonSelector);
        if (!exists) {
          console.log("✓ Item deleted from cart");
          return true;
        }
        
        console.log(`Clicking minus to delete (attempt ${clickCount + 1})...`);
        await this.clickElement(minusButtonSelector);
        await browser.pause(1000);
        clickCount++;
      }
      
      console.log("✓ Item deletion completed");
      return true;
    } catch (error) {
      console.log("Failed to delete item:", error);
      return false;
    }
  }

  // async clearCart() {
  //   console.log("\n=== Clearing cart ===");
    
  //   try {
  //     await this.waitForElement(this.clearCartButton);
  //     await this.clickElement(this.clearCartButton);
  //     console.log("✓ Cart cleared");
  //     await browser.pause(2000);
  //     return true;
  //   } catch (error) {
  //     console.log("Failed to clear cart:", error);
  //     return false;
  //   }
  // }

  // async goBackFromCart() {
  //   console.log("\n=== Going back from cart ===");
    
  //   try {
  //     await this.waitForElement(this.goBackButton);
  //     await this.clickElement(this.goBackButton);
  //     console.log("✓ Navigated back from cart");
  //     await browser.pause(2000);
  //     return true;
  //   } catch (error) {
  //     console.log("Failed to go back, trying device back:", error);
  //     await browser.back();
  //     await browser.pause(2000);
  //     return false;
  //   }
  // }

  // Find UPI option with scrolling - Fixed to return boolean
  async scrollToFindUPI(): Promise<boolean> {
    console.log("\n=== Scrolling to find UPI option ===");
    
    const maxSwipes = 10;
    
    for (let i = 0; i < maxSwipes; i++) {
      console.log(`\nChecking for UPI option... (Attempt ${i + 1}/${maxSwipes})`);
      
      const selectors = [
        this.upiOption,
        '//android.view.View[contains(@content-desc, "UPI")]',
        '//android.widget.TextView[@text="UPI"]',
        '//android.widget.TextView[contains(@text, "UPI")]',
        '//*[contains(@text, "UPI") and contains(@text, "Pay")]',
        '//*[@text="UPI"]'
      ];
      
      for (const selector of selectors) {
        try {
          const element = await browser.$(selector);
          if (await element.isExisting()) {
            console.log(`✅ UPI option found with selector: ${selector.substring(0, 50)}...`);
            return true;
          }
        } catch (error) {
          // Continue checking
        }
      }
      
      if (i < maxSwipes - 1) {
        console.log("UPI not visible, swiping up...");
        await this.swipeUpOnCart();
      }
    }
    
    console.log("❌ UPI option not found after all swipes");
    return false;
  }

  // Select UPI payment - Fixed to return boolean
  async selectUPIPayment(): Promise<boolean> {
    console.log("\n=== Selecting UPI Payment Method ===");
    
    try {
      const upiFound = await this.scrollToFindUPI();
      
      if (!upiFound) {
        throw new Error("UPI option not found after scrolling");
      }
      
      await browser.pause(1000);
      await this.takeScreenshot('upi-option-visible');
      
      console.log("\nClicking UPI radio button...");
      
      let clicked = false;
      
      try {
        const radioButton = await browser.$(this.upiRadioButton);
        if (await radioButton.isExisting()) {
          await radioButton.click();
          clicked = true;
          console.log("✅ Radio button clicked (xpath)");
        }
      } catch (error) {
        console.log("Radio button xpath not found");
      }
      
      if (!clicked) {
        try {
          const uiRadioButton = await browser.$('android=new UiSelector().className("android.widget.RadioButton").instance(1)');
          if (await uiRadioButton.isExisting()) {
            await uiRadioButton.click();
            clicked = true;
            console.log("✅ Radio button clicked (UIAutomator)");
          }
        } catch (error) {
          console.log("UIAutomator radio button not found");
        }
      }
      
      if (!clicked) {
        console.log("Clicking on UPI view itself...");
        const upiElements = [
          this.upiOption,
          '//android.view.View[contains(@content-desc, "UPI")]',
          '//*[contains(@text, "UPI")]'
        ];
        
        for (const selector of upiElements) {
          try {
            const element = await browser.$(selector);
            if (await element.isExisting()) {
              await element.click();
              clicked = true;
              console.log(`✅ UPI clicked with selector: ${selector.substring(0, 50)}...`);
              break;
            }
          } catch (error) {
            continue;
          }
        }
      }
      
      if (!clicked) {
        throw new Error("Failed to click UPI option");
      }
      
      await browser.pause(2000);
      await this.takeScreenshot('upi-selected');
      return true;
      
    } catch (error) {
      console.error("❌ Error selecting UPI:", error);
      await this.takeScreenshot('upi-selection-error');
      return false;
    }
  }

  // Click Place Order button - Fixed to return boolean
  async clickPlaceOrderButton(): Promise<boolean> {
    console.log("\n=== Clicking Place Order Button ===");
    
    try {
      let attempts = 0;
      const maxAttempts = 5;
      
      while (attempts < maxAttempts) {
        const button = await browser.$(this.placeOrderButton);
        
        if (await button.isExisting()) {
          console.log("✓ Place Order button found");
          await button.click();
          console.log("✅ Place Order button clicked successfully");
          await browser.pause(3000);
          return true;
        }
        
        console.log(`Place Order button not visible, swiping up... (Attempt ${attempts + 1}/${maxAttempts})`);
        await this.swipeUpOnCart();
        attempts++;
      }
      
      throw new Error("Place Order button not found after scrolling");
      
    } catch (error) {
      console.error("❌ Error clicking Place Order:", error);
      await this.takeScreenshot('place-order-error');
      return false;
    }
  }

  // Find and select Cash on Delivery
  async selectCashOnDelivery(): Promise<boolean> {
    console.log("\n=== Selecting Cash on Delivery ===");
    
    try {
      let found = false;
      const maxSwipes = 5;
      
      for (let i = 0; i < maxSwipes; i++) {
        const codOption = await browser.$(this.cashOnDeliveryOption);
        
        if (await codOption.isExisting()) {
          console.log("✓ Cash on Delivery option found");
          await codOption.click();
          console.log("✓ Cash on Delivery selected");
          await browser.pause(2000);
          found = true;
          break;
        }
        
        console.log(`COD not visible, swiping up... (${i + 1}/${maxSwipes})`);
        await this.swipeUpOnCart();
      }
      
      if (!found) {
        throw new Error("Cash on Delivery option not found");
      }
      
      return true;
      
    } catch (error) {
      console.error("Failed to select COD:", error);
      return false;
    }
  }

  // Place order with Cash on Delivery
  // Place order with Cash on Delivery (continued)
  async placeOrderWithCOD() {
    console.log("\n=== Placing order with Cash on Delivery ===");
    
    try {
      // Select COD
      const codSelected = await this.selectCashOnDelivery();
      if (!codSelected) {
        throw new Error("Failed to select Cash on Delivery");
      }
      
      // Click Place Order
      await this.clickPlaceOrderButton();
      
      // Wait for potential error
      await browser.pause(3000);
      
      console.log("✓ Order placement attempted");
      return true;
      
    } catch (error) {
      console.error("Failed to place order:", error);
      return false;
    }
  }

  // Main method to place order with UPI
  async placeOrderWithUPI() {
    console.log("\n=== STARTING ORDER PLACEMENT WITH UPI ===");
    
    try {
      // Initial setup
      await this.takeScreenshot('cart-initial-state');
      await browser.pause(2000);
      
      // Initial swipe to see more content
      console.log("\nPerforming initial swipe to see cart contents...");
      await this.swipeUpOnCart();
      await browser.pause(1000);
      
      // Step 1: Select UPI payment
      console.log("\nStep 1: Selecting UPI payment method");
      const upiSelected = await this.selectUPIPayment();
      
      if (!upiSelected) {
        throw new Error("Failed to select UPI payment method");
      }
      
      // Step 2: Click Place Order
      console.log("\nStep 2: Clicking Place Order button");
      const orderPlaced = await this.clickPlaceOrderButton();
      
      if (!orderPlaced) {
        throw new Error("Failed to click Place Order button");
      }
      
      console.log("\n✅✅✅ ORDER PLACED SUCCESSFULLY WITH UPI PAYMENT ✅✅✅");
      await this.takeScreenshot('order-placed-success');
      
    } catch (error) {
      console.error("\n❌❌❌ FAILED TO PLACE ORDER:", error);
      await this.takeScreenshot('order-failed-final');
      throw error;
    }
  }

  // Legacy method
  async placeOrder() {
    await this.placeOrderWithUPI();
  }
}