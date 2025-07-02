// src/pages/products.page.ts - Updated with correct selectors
import { BasePage } from './base.page';
import { browser } from '@wdio/globals';

export class ProductsPage extends BasePage {
  // Correct selectors based on your input
  private getAddButtonByIndex(index: number) {
    return `(//android.view.View[@content-desc="Add"])[${index}]`;
  }

  // Dynamic selectors for + and - buttons based on product description
  private getProductPlusButton(productDesc: string) {
    return `//android.view.View[contains(@content-desc, "${productDesc}")]/android.view.View[2]`;
  }

  private getProductMinusButton(productDesc: string) {
    return `//android.view.View[contains(@content-desc, "${productDesc}")]/android.view.View[1]`;
  }

  // Generic selectors for first visible product controls
  private get firstProductPlusButton() {
    return '(//android.view.View[contains(@content-desc, "₹") and contains(@content-desc, "Save")]/android.view.View[2])[1]';
  }

  private get firstProductMinusButton() {
    return '(//android.view.View[contains(@content-desc, "₹") and contains(@content-desc, "Save")]/android.view.View[1])[1]';
  }

  // View cart selector
  private get viewCartButton() {
    return '//android.view.View[contains(@content-desc, "Cart Total")]';
  }

  // Swipe up on home page using exact coordinates
  async swipeUpToSeeProducts() {
    console.log("Swiping up to see products...");
    
    try {
      // Using your exact coordinates
      await browser.action('pointer')
        .move({ duration: 0, x: 542, y: 1375 })
        .down({ button: 0 })
        .move({ duration: 1000, x: 563, y: 692 })
        .up({ button: 0 })
        .perform();
      
      console.log("✓ Swipe completed");
      await browser.pause(2000);
    } catch (error) {
      console.error("Swipe failed:", error);
      // Fallback to percentage-based swipe
      const { width, height } = await browser.getWindowSize();
      await browser.action('pointer')
        .move({ duration: 0, x: width / 2, y: height * 0.8 })
        .down({ button: 0 })
        .move({ duration: 1000, x: width / 2, y: height * 0.3 })
        .up({ button: 0 })
        .perform();
      await browser.pause(2000);
    }
  }

  // Add products one by one with stability checks
  async addProducts(count: number): Promise<number> {
    console.log(`\n=== Adding ${count} products ===`);
    let addedCount = 0;

    for (let i = 1; i <= count; i++) {
      try {
        const selector = this.getAddButtonByIndex(i);
        
        // Wait for button to be visible
        await browser.pause(500);
        const exists = await this.isElementExisting(selector);
        
        if (exists) {
          console.log(`Adding product ${i}...`);
          const addButton = await browser.$(selector);
          await addButton.click();
          await browser.pause(1500);
          addedCount++;
          console.log(`✓ Product ${i} added`);
          await this.takeScreenshot(`product-${i}-added`);
        } else {
          console.log(`Product ${i} Add button not found`);
        }
      } catch (error) {
        console.log(`Failed to add product ${i}:`, error);
      }
    }

    console.log(`\nTotal products added: ${addedCount}`);
    return addedCount;
  }

  // Delete products using the exact minus button xpath pattern
  async deleteProducts(positions: number[]): Promise<number> {
    console.log(`\n=== Deleting products at positions: ${positions.join(', ')} ===`);
    let deletedCount = 0;

    for (const position of positions) {
      try {
        // Find the minus button for products that have been added (they will have the price info)
        const minusButtonXpath = `(//android.view.View[contains(@content-desc, "₹") and contains(@content-desc, "Save")]/android.view.View[1])[${position}]`;
        
        const exists = await this.isElementExisting(minusButtonXpath);
        if (exists) {
          console.log(`Deleting product at position ${position}...`);
          const minusButton = await browser.$(minusButtonXpath);
          await minusButton.click();
          await browser.pause(1500);
          deletedCount++;
          console.log(`✓ Product deleted`);
          await this.takeScreenshot(`product-position-${position}-deleted`);
        } else {
          console.log(`Minus button not found at position ${position}`);
        }
      } catch (error) {
        console.log(`Failed to delete product at position ${position}:`, error);
      }
    }

    console.log(`\nTotal products deleted: ${deletedCount}`);
    return deletedCount;
  }

  // Increase product quantity with exact xpath pattern
  async increaseProductQuantity(position: number, increaseBy: number): Promise<boolean> {
    console.log(`\n=== Increasing quantity of product at position ${position} by ${increaseBy} ===`);
    
    try {
      // Using the exact xpath pattern for plus button
      const plusButtonXpath = `(//android.view.View[contains(@content-desc, "₹") and contains(@content-desc, "Save")]/android.view.View[2])[${position}]`;
      
      const exists = await this.isElementExisting(plusButtonXpath);
      if (!exists) {
        console.log("Plus button not found");
        return false;
      }

      const plusButton = await browser.$(plusButtonXpath);
      
      for (let i = 0; i < increaseBy; i++) {
        console.log(`Clicking plus button (${i + 1}/${increaseBy})...`);
        await plusButton.click();
        await browser.pause(1000);
      }
      
      console.log(`✓ Increased quantity by ${increaseBy}`);
      await this.takeScreenshot(`product-quantity-increased-${position}`);
      return true;
    } catch (error) {
      console.log(`Failed to increase quantity:`, error);
      return false;
    }
  }

  // Click View Cart
  async clickViewCart(): Promise<boolean> {
    console.log("\n=== Clicking View Cart ===");
    
    try {
      await browser.pause(1000);
      const viewCartExists = await this.isElementExisting(this.viewCartButton);
      
      if (!viewCartExists) {
        console.log("View Cart button not found");
        return false;
      }

      const viewCartBtn = await browser.$(this.viewCartButton);
      await viewCartBtn.click();
      console.log("✓ View Cart clicked");
      await browser.pause(3000);
      return true;
    } catch (error) {
      console.log("Failed to click View Cart:", error);
      return false;
    }
  }
}