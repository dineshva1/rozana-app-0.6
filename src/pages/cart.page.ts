import { BasePage } from './base.page';
import { browser } from '@wdio/globals';

export class CartPage extends BasePage {
  // Selectors
  private get myCartTitle() {
    return '//android.widget.TextView[contains(@text, "My Cart")]';
  }

  private get placeOrderButton() {
    return '//android.widget.Button[contains(@content-desc, "Place Order")]';
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
      // Get screen dimensions
      const { width, height } = await browser.getWindowSize();
      
      // Calculate coordinates similar to your example
      const startX = Math.floor(width * 0.5);  // Center of screen
      const startY = Math.floor(height * 0.7); // Start at 70% height
      const endX = Math.floor(width * 0.5);    // Keep center
      const endY = Math.floor(height * 0.2);   // End at 20% height
      
      console.log(`Swiping from (${startX}, ${startY}) to (${endX}, ${endY})`);
      
      // Use the exact same format as Appium Inspector
      await browser.action('pointer')
        .move({ duration: 0, x: startX, y: startY })
        .down({ button: 0 })
        .move({ duration: 1000, x: endX, y: endY })
        .up({ button: 0 })
        .perform();
      
      console.log("✓ Swipe completed");
      await browser.pause(1500); // Wait for scroll animation
      
    } catch (error) {
      console.error("Error during swipe:", error);
      throw error;
    }
  }

  // Find UPI option with scrolling
  async scrollToFindUPI(): Promise<boolean> {
    console.log("\n=== Scrolling to find UPI option ===");
    
    const maxSwipes = 10;
    
    for (let i = 0; i < maxSwipes; i++) {
      console.log(`\nChecking for UPI option... (Attempt ${i + 1}/${maxSwipes})`);
      
      // Check multiple selectors for UPI
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
      
      // If not found, swipe up
      if (i < maxSwipes - 1) {
        console.log("UPI not visible, swiping up...");
        await this.swipeUpOnCart();
      }
    }
    
    console.log("❌ UPI option not found after all swipes");
    return false;
  }

  // Select UPI payment
  async selectUPIPayment(): Promise<boolean> {
    console.log("\n=== Selecting UPI Payment Method ===");
    
    try {
      // Step 1: Scroll to find UPI
      const upiFound = await this.scrollToFindUPI();
      
      if (!upiFound) {
        throw new Error("UPI option not found after scrolling");
      }
      
      await browser.pause(1000);
      await this.takeScreenshot('upi-option-visible');
      
      // Step 2: Click the radio button
      console.log("\nClicking UPI radio button...");
      
      let clicked = false;
      
      // Method 1: Try radio button xpath
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
      
      // Method 2: UIAutomator selector
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
      
      // Method 3: Click UPI view
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

  // Click Place Order button
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
        
        // If not found, swipe up
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