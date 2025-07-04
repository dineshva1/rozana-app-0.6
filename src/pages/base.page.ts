// src/pages/base.page.ts
import { browser } from '@wdio/globals';

export class BasePage {
  async findElement(selector: string, timeout: number = 20000) {
    const element = await browser.$(selector);
    await element.waitForExist({ timeout });
    return element;
  }

  async findElementSafe(selector: string, timeout: number = 5000) {
    try {
      const element = await browser.$(selector);
      await element.waitForExist({ timeout });
      return element;
    } catch {
      return null;
    }
  }

  async clickElement(selector: string) {
    const element = await this.findElement(selector);
    await element.waitForDisplayed({ timeout: 5000 });
    await element.click();
  }

  async clickElementByAccessibilityId(id: string) {
    const element = await browser.$(`~${id}`);
    await element.waitForExist({ timeout: 20000 });
    await element.click();
  }

  async clickElementSafe(selector: string): Promise<boolean> {
    try {
      const element = await this.findElementSafe(selector);
      if (element) {
        await element.click();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  async isElementExisting(selector: string): Promise<boolean> {
    try {
      const element = await browser.$(selector);
      return await element.isExisting();
    } catch {
      return false;
    }
  }

  async isElementDisplayed(selector: string): Promise<boolean> {
    try {
      const element = await browser.$(selector);
      return await element.isDisplayed();
    } catch {
      return false;
    }
  }

  async setValue(selector: string, value: string) {
    const element = await this.findElement(selector);
    await element.waitForDisplayed({ timeout: 5000 });
    await element.clearValue();
    await browser.pause(500);
    await element.setValue(value);
    await browser.pause(500);
  }

  async getText(selector: string): Promise<string> {
    const element = await this.findElement(selector);
    return await element.getText();
  }

  async getAttribute(selector: string, attribute: string): Promise<string> {
    const element = await this.findElement(selector);
    return await element.getAttribute(attribute);
  }

  async waitForElement(selector: string, timeout: number = 20000) {
    const element = await browser.$(selector);
    await element.waitForDisplayed({ timeout });
    return element;
  }

  async waitForText(selector: string, text: string, timeout: number = 20000) {
    await browser.waitUntil(
      async () => {
        const element = await browser.$(selector);
        const elementText = await element.getText();
        return elementText.includes(text);
      },
      {
        timeout,
        timeoutMsg: `Text "${text}" not found in element ${selector} after ${timeout}ms`,
      }
    );
  }

  async takeScreenshot(name: string) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    await browser.saveScreenshot(`./screenshots/${name}-${timestamp}.png`);
  }

  // Navigation Methods
  async goBack(): Promise<boolean> {
    console.log("Attempting to go back...");
    
    // List of possible back button selectors
    const backButtonSelectors = [
      // Your specific back button selector
      '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.view.View[1]/android.widget.Button',
      // Common back button selectors
      '//android.widget.Button[1]',
      '//android.widget.ImageButton[@content-desc="Navigate up"]',
      '//android.widget.ImageButton[@content-desc="Back"]',
      '//android.widget.ImageView[@content-desc="Back"]',
      '//android.widget.TextView[@content-desc="Back"]',
      // Generic first button (often the back button)
      '(//android.widget.Button)[1]',
      // Back arrow variations
      '//android.widget.ImageButton[contains(@content-desc, "back")]',
      '//android.widget.ImageButton[contains(@content-desc, "Back")]',
      '//android.widget.Button[contains(@content-desc, "back")]',
      '//android.widget.Button[contains(@content-desc, "Back")]'
    ];
    
    // Try each selector
    for (const selector of backButtonSelectors) {
      try {
        const backButton = await browser.$(selector);
        if (await backButton.isExisting()) {
          console.log(`Found back button with selector: ${selector.substring(0, 50)}...`);
          await backButton.click();
          console.log("✓ Back button clicked successfully");
          await browser.pause(2000);
          return true;
        }
      } catch (error) {
        // Continue to next selector
        continue;
      }
    }
    
    // If no back button found, use Android system back
    console.log("No back button found in UI, using Android system back...");
    try {
      await browser.back();
      console.log("✓ Android system back executed");
      await browser.pause(2000);
      return true;
    } catch (error) {
      console.error("Failed to execute system back:", error);
      return false;
    }
  }

  // async navigateToHome(): Promise<boolean> {
  //   console.log("Navigating to home...");
    
  //   // List of possible home tab selectors
  //   const homeTabSelectors = [
  //     '//android.widget.Button[@content-desc="Home\nTab 1 of 5"]',
  //     '//android.widget.Button[contains(@content-desc, "Home")]',
  //     '//android.widget.Button[contains(@content-desc, "home")]',
  //     '//android.view.View[@content-desc="Home"]',
  //     '//android.widget.TextView[@text="Home"]',
  //     '//android.widget.TextView[contains(@text, "Home")]'
  //   ];
    
  //   // Try each selector
  //   for (const selector of homeTabSelectors) {
  //     try {
  //       const homeTab = await browser.$(selector);
  //       if (await homeTab.isExisting()) {
  //         console.log(`Found home tab with selector: ${selector.substring(0, 50)}...`);
  //         await homeTab.click();
  //         console.log("✓ Home tab clicked successfully");
  //         await browser.pause(2500);
  //         return true;
  //       }
  //     } catch (error) {
  //       // Continue to next selector
  //       continue;
  //     }
  //   }
    
  //   console.error("❌ Could not find home tab");
  //   return false;
  // }

  async navigateToCart(): Promise<boolean> {
    console.log("Navigating to cart...");
    
    // List of possible cart tab selectors
    const cartTabSelectors = [
      '//android.widget.Button[@content-desc="Cart\nTab 3 of 5"]',
      '//android.widget.Button[contains(@content-desc, "Cart")]',
      '//android.widget.Button[contains(@content-desc, "cart")]',
      '//android.view.View[@content-desc="Cart"]',
      '//android.widget.TextView[@text="Cart"]',
      '//android.widget.TextView[contains(@text, "Cart")]'
    ];
    
    // Try each selector
    for (const selector of cartTabSelectors) {
      try {
        const cartTab = await browser.$(selector);
        if (await cartTab.isExisting()) {
          console.log(`Found cart tab with selector: ${selector.substring(0, 50)}...`);
          await cartTab.click();
          console.log("✓ Cart tab clicked successfully");
          await browser.pause(2500);
          return true;
        }
      } catch (error) {
        // Continue to next selector
        continue;
      }
    }
    
    console.error("❌ Could not find cart tab");
    return false;
  }

  // Combined navigation method
  async navigateBackToHome(): Promise<boolean> {
    console.log("Navigating back to home page...");
    
    // First try to go back
    const wentBack = await this.goBack();
    if (wentBack) {
      await browser.pause(1000);
    }
    
    // Then ensure we're on home page
    const wentHome = await this.navigateToHome();
    
    return wentBack || wentHome;
  }

  // Helper to check if we're on a specific page
  async isOnPage(pageIdentifiers: string[]): Promise<boolean> {
    for (const identifier of pageIdentifiers) {
      if (await this.isElementExisting(identifier)) {
        return true;
      }
    }
    return false;
  }
async navigateToHome(): Promise<boolean> {
  console.log("Navigating to home...");
  
  // List of possible home tab selectors - UPDATED with newline
  const homeTabSelectors = [
    // New UI selectors with newline
    '//android.widget.ImageView[@content-desc="Home\nTab 1 of 4"]',
    // Alternative without ImageView in case it changes
    '//*[@content-desc="Home\nTab 1 of 4"]',
    // Old selectors for backward compatibility
    '//android.widget.ImageView[@content-desc="Home Tab 1 of 4"]',
    '//android.widget.Button[@content-desc="Home\nTab 1 of 5"]',
    '//android.widget.Button[contains(@content-desc, "Home")]',
    '//android.widget.Button[contains(@content-desc, "home")]',
    '//android.view.View[@content-desc="Home"]',
    '//android.widget.TextView[@text="Home"]',
    '//android.widget.TextView[contains(@text, "Home")]'
  ];
  
  // Try each selector
  for (const selector of homeTabSelectors) {
    try {
      const homeTab = await browser.$(selector);
      if (await homeTab.isExisting()) {
        console.log(`Found home tab with selector: ${selector.substring(0, 50)}...`);
        await homeTab.click();
        console.log("✓ Home tab clicked successfully");
        await browser.pause(2500);
        return true;
      }
    } catch (error) {
      // Continue to next selector
      continue;
    }
  }
  
  console.error("❌ Could not find home tab");
  return false;
}

}