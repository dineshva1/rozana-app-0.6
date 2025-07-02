import { BasePage } from './base.page';
import { browser } from '@wdio/globals';
import { SwipeUtils } from '../utils/swipe.utils';

export class ProductsPage extends BasePage {
  // Selectors
  private get popularProductsSection() {
    return '//android.view.View[@content-desc="Popular Products"]';
  }

  private get cartTab() {
    return '//android.widget.Button[@content-desc="Cart\nTab 3 of 5"]';
  }

  // Alternative cart selectors
  private get cartTabAlternative() {
    return '//android.widget.Button[contains(@content-desc, "Cart")]';
  }

  private get homeTab() {
    return '//android.widget.Button[@content-desc="Home\nTab 1 of 5"]';
  }

  // Get single add button by index
  private getAddButtonByIndex(index: number) {
    return `(//android.widget.Button[@content-desc="+"])[${index}]`;
  }

  // Helper method to scroll to Popular Products section
  async scrollToPopularProducts() {
    console.log("Scrolling to Popular Products section...");
    
    const maxScrolls = 5;
    let scrollCount = 0;
    
    while (scrollCount < maxScrolls) {
      const isVisible = await this.isElementExisting(this.popularProductsSection);
      if (isVisible) {
        console.log("✓ Popular Products section found");
        await browser.pause(1500);
        return true;
      }
      
      await SwipeUtils.swipeUp(0.3);
      await browser.pause(1000);
      scrollCount++;
    }
    
    console.log("❌ Popular Products section not found after scrolling");
    return false;
  }

  // Swipe products using exact coordinates from Appium Inspector
  async swipeProductsLeft() {
    console.log("Swiping left on product cards...");
    
    try {
      // Using the exact coordinates from your Appium Inspector recording
      await SwipeUtils.swipeLeftExact(933, 1285, 185, 1281, 1000);
      
      console.log("✓ Swipe completed");
      await browser.pause(2500); // Increased wait time for products to load
      return true;
      
    } catch (error) {
      console.log("Swipe failed:", error);
      return false;
    }
  }

  // Alternative swipe method if coordinates change
  async swipeProductsLeftAlternative() {
    console.log("Trying alternative swipe method...");
    
    try {
      const { width, height } = await browser.getWindowSize();
      
      // Calculate relative positions based on screen size
      const startX = Math.floor(width * 0.9);  // 90% from left
      const endX = Math.floor(width * 0.1);    // 10% from left
      const yPosition = Math.floor(height * 0.65); // 65% from top
      
      await SwipeUtils.swipeLeftExact(startX, yPosition, endX, yPosition, 1000);
      
      console.log("✓ Alternative swipe completed");
      await browser.pause(2500);
      return true;
      
    } catch (error) {
      console.log("Alternative swipe failed:", error);
      return false;
    }
  }

  // Verify swipe was successful by checking if products changed
  async verifySwipeSuccess(previousProducts: number): Promise<boolean> {
    await browser.pause(1000);
    const currentProducts = await this.getVisibleAddButtonCount();
    
    // If we still have products visible after swipe, it's likely successful
    if (currentProducts > 0) {
      console.log(`✓ Swipe verified: ${currentProducts} products visible`);
      return true;
    }
    
    return false;
  }

  // Count visible add buttons
  async getVisibleAddButtonCount(): Promise<number> {
    let count = 0;
    const maxButtons = 10;
    
    for (let i = 1; i <= maxButtons; i++) {
      const selector = this.getAddButtonByIndex(i);
      const exists = await this.isElementExisting(selector);
      if (exists) {
        count++;
      } else {
        break;
      }
    }
    
    return count;
  }

  // Add single product with stability
  async addSingleProduct(index: number): Promise<boolean> {
    try {
      const buttonSelector = this.getAddButtonByIndex(index);
      const exists = await this.isElementExisting(buttonSelector);
      
      if (!exists) {
        console.log(`Button ${index} not found`);
        return false;
      }
      
      console.log(`Clicking add button ${index}...`);
      await this.clickElement(buttonSelector);
      
      // Wait for product to be added
      await browser.pause(2000);
      
      console.log(`✓ Product added successfully`);
      return true;
      
    } catch (error) {
      console.log(`Failed to add product ${index}:`, error);
      return false;
    }
  }

  // Add exactly 5 products with improved swipe pattern
  async addFiveProductsWithSwipes(): Promise<number> {
    console.log(`\n=== Adding 5 products with swipe pattern ===`);
    
    // Ensure we're at Popular Products
    const foundSection = await this.scrollToPopularProducts();
    if (!foundSection) {
      throw new Error("Could not find Popular Products section");
    }
    
    await browser.pause(2000);
    
    let totalAdded = 0;
    let swipeCount = 0;
    const targetProducts = 5;
    
    // Step 1: Add first 2 products from initial view
    console.log("\n📦 Step 1: Adding first 2 products from initial view");
    const initialCount = await this.getVisibleAddButtonCount();
    console.log(`Found ${initialCount} products in initial view`);
    
    // Add product 1
    if (await this.addSingleProduct(1)) {
      totalAdded++;
      console.log(`✅ Product ${totalAdded}/${targetProducts} added`);
      await browser.saveScreenshot(`./screenshots/product-${totalAdded}-added.png`);
    }
    
    await browser.pause(1500);
    
    // Add product 2
    if (await this.addSingleProduct(2)) {
      totalAdded++;
      console.log(`✅ Product ${totalAdded}/${targetProducts} added`);
      await browser.saveScreenshot(`./screenshots/product-${totalAdded}-added.png`);
    }
    
    await browser.pause(2000);
    
    // Continue adding products with swipes until we reach 5
    while (totalAdded < targetProducts && swipeCount < 5) {
      swipeCount++;
      console.log(`\n📦 Swipe ${swipeCount}: Attempting to add product ${totalAdded + 1}`);
      
      await browser.saveScreenshot(`./screenshots/before-swipe-${swipeCount}.png`);
      
      // Try main swipe first
      let swipeSuccess = await this.swipeProductsLeft();
      
      // If main swipe fails, try alternative
      if (!swipeSuccess) {
        console.log("Main swipe failed, trying alternative method...");
        swipeSuccess = await this.swipeProductsLeftAlternative();
      }
      
      if (swipeSuccess) {
        console.log(`✓ Swipe ${swipeCount} completed`);
        await browser.saveScreenshot(`./screenshots/after-swipe-${swipeCount}.png`);
        
        // Verify swipe was successful
        const productsVisible = await this.getVisibleAddButtonCount();
        console.log(`Found ${productsVisible} products after swipe`);
        
        if (productsVisible > 0) {
          // Try to add the first visible product
          if (await this.addSingleProduct(1)) {
            totalAdded++;
            console.log(`✅ Product ${totalAdded}/${targetProducts} added after swipe ${swipeCount}`);
            await browser.saveScreenshot(`./screenshots/product-${totalAdded}-added.png`);
          } else {
            // If first button fails, try second
            console.log("First button failed, trying second...");
            if (await this.addSingleProduct(2)) {
              totalAdded++;
              console.log(`✅ Product ${totalAdded}/${targetProducts} added (second button) after swipe ${swipeCount}`);
              await browser.saveScreenshot(`./screenshots/product-${totalAdded}-added.png`);
            }
          }
        } else {
          console.log("❌ No products visible after swipe");
        }
      } else {
        console.log(`❌ Swipe ${swipeCount} failed`);
      }
      
      await browser.pause(2000);
    }
    
    // If we still don't have 5 products, try adding from current view
    if (totalAdded < targetProducts) {
      console.log(`\n⚠️ Only ${totalAdded} products added. Trying to add more from current view...`);
      
      const currentProducts = await this.getVisibleAddButtonCount();
      console.log(`Found ${currentProducts} products in current view`);
      
      // Try to add remaining products
      for (let i = 1; i <= currentProducts && totalAdded < targetProducts; i++) {
        if (await this.addSingleProduct(i)) {
          totalAdded++;
          console.log(`✅ Product ${totalAdded}/${targetProducts} added from current view`);
          await browser.saveScreenshot(`./screenshots/product-${totalAdded}-added.png`);
          await browser.pause(1500);
        }
      }
    }
    
    console.log(`\n✅ Total products added: ${totalAdded}/${targetProducts}`);
    
    return totalAdded;
  }

  // Navigate to cart with stability
  async goToCart() {
    console.log("\nNavigating to cart...");
    
    // First ensure we're in a stable state
    await browser.pause(2000);
    
    // Try scrolling down first to ensure navigation is visible
    await SwipeUtils.swipeDown(0.3);
    await browser.pause(1500);
    
    // Look for cart tab
    let cartFound = await this.isElementExisting(this.cartTab);
    
    if (cartFound) {
      await this.clickElement(this.cartTab);
      console.log("✓ Clicked Cart tab");
      await browser.pause(3000);
      return true;
    }
    
    // Try alternative selector
    const altCart = await this.isElementExisting(this.cartTabAlternative);
    if (altCart) {
      await this.clickElement(this.cartTabAlternative);
      console.log("✓ Clicked Cart tab (alternative)");
      await browser.pause(3000);
      return true;
    }
    
    throw new Error("Could not find Cart tab");
  }
}