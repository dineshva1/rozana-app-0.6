// src/pages/featured-products.page.ts
import { BasePage } from './base.page';
import { browser } from '@wdio/globals';
import { SwipeUtils } from '../utils/swipe.utils';

export class FeaturedProductsPage extends BasePage {
  // Selectors
  private get featuredProductsSection() {
    return '//android.view.View[@content-desc="Featured Products"]';
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

  // Helper method to scroll to Featured Products section
  async scrollToFeaturedProducts() {
    console.log("Scrolling to Featured Products section...");
    
    const maxScrolls = 8; // More scrolls since Featured Products is further down
    let scrollCount = 0;
    
    while (scrollCount < maxScrolls) {
      const isVisible = await this.isElementExisting(this.featuredProductsSection);
      if (isVisible) {
        console.log("✓ Featured Products section found");
        // Do additional small swipes to ensure full visibility
        await browser.pause(1000);
        await SwipeUtils.swipeUp(0.2);
        await browser.pause(1000);
        await SwipeUtils.swipeUp(0.2);
        await browser.pause(1500);
        return true;
      }
      
      await SwipeUtils.swipeUp(0.3);
      await browser.pause(1000);
      scrollCount++;
    }
    
    console.log("❌ Featured Products section not found after scrolling");
    return false;
  }

  // Swipe products using dynamic coordinates
  async swipeProductsLeft() {
    console.log("Swiping left on featured product cards...");
    
    try {
      const { width, height } = await browser.getWindowSize();
      
      // Calculate positions - Featured Products carousel is around 68% down the screen
      const startX = Math.floor(width * 0.9);
      const endX = Math.floor(width * 0.1);
      const yPosition = Math.floor(height * 0.68); // Adjusted for Featured Products position
      
      await SwipeUtils.swipeLeftExact(startX, yPosition, endX, yPosition, 1000);
      
      console.log("✓ Swipe completed");
      await browser.pause(2500);
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
      
      // Try multiple Y positions for Featured Products
      const yPositions = [
        Math.floor(height * 0.68), // 68% from top
        Math.floor(height * 0.70), // 70% from top
        Math.floor(height * 0.65), // 65% from top
      ];
      
      for (const yPos of yPositions) {
        const startX = Math.floor(width * 0.9);
        const endX = Math.floor(width * 0.1);
        
        await SwipeUtils.swipeLeftExact(startX, yPos, endX, yPos, 1000);
        await browser.pause(2000);
        
        // Check if swipe worked by looking for new products
        const productsVisible = await this.getVisibleAddButtonCount();
        if (productsVisible > 0) {
          console.log(`✓ Alternative swipe completed at Y: ${yPos}`);
          return true;
        }
      }
      
      return false;
      
    } catch (error) {
      console.log("Alternative swipe failed:", error);
      return false;
    }
  }

  // Count visible add buttons in Featured Products area
  async getVisibleAddButtonCount(): Promise<number> {
    let count = 0;
    const maxButtons = 10;
    
    // Ensure Featured Products section is visible
    const sectionExists = await this.isElementExisting(this.featuredProductsSection);
    if (!sectionExists) {
      return 0;
    }
    
    // Count buttons that are in the Featured Products area
    const section = await browser.$(this.featuredProductsSection);
    const sectionLocation = await section.getLocation();
    
    for (let i = 1; i <= maxButtons; i++) {
      const selector = this.getAddButtonByIndex(i);
      try {
        const button = await browser.$(selector);
        if (await button.isExisting()) {
          const buttonLocation = await button.getLocation();
          // Only count buttons that are below the Featured Products header
          if (buttonLocation.y > sectionLocation.y) {
            count++;
          }
        }
      } catch (error) {
        // Button doesn't exist, continue
        continue;
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
      
      console.log(`✓ Featured product added successfully`);
      return true;
      
    } catch (error) {
      console.log(`Failed to add featured product ${index}:`, error);
      return false;
    }
  }

  // Add exactly 5 featured products with improved swipe pattern
  async addFiveFeaturedProductsWithSwipes(): Promise<number> {
    console.log(`\n=== Adding 5 featured products with swipe pattern ===`);
    
    // Ensure we're at Featured Products
    const foundSection = await this.scrollToFeaturedProducts();
    if (!foundSection) {
      throw new Error("Could not find Featured Products section");
    }
    
    await browser.pause(2000);
    
    let totalAdded = 0;
    let swipeCount = 0;
    const targetProducts = 5;
    const addedProducts = new Set<string>(); // Track unique products
    let currentBatchStart = 1; // Track where to start looking for products
    
    // Step 1: Add first 2 products from initial view
    console.log("\n📦 Step 1: Adding first 2 featured products from initial view");
    const initialCount = await this.getVisibleAddButtonCount();
    console.log(`Found ${initialCount} featured products in initial view`);
    
    // Add product 1
    if (await this.addSingleProduct(1)) {
      totalAdded++;
      addedProducts.add(`batch0-product1`);
      console.log(`✅ Featured product ${totalAdded}/${targetProducts} added`);
      await browser.saveScreenshot(`./screenshots/featured-product-${totalAdded}-added.png`);
    }
    
    await browser.pause(1500);
    
    // Add product 2
    if (totalAdded < targetProducts && await this.addSingleProduct(2)) {
      totalAdded++;
      addedProducts.add(`batch0-product2`);
      console.log(`✅ Featured product ${totalAdded}/${targetProducts} added`);
      await browser.saveScreenshot(`./screenshots/featured-product-${totalAdded}-added.png`);
    }
    
    await browser.pause(2000);
    
    // Continue adding products with swipes until we reach 5
    while (totalAdded < targetProducts && swipeCount < 5) {
      swipeCount++;
      console.log(`\n📦 Swipe ${swipeCount}: Attempting to add featured product ${totalAdded + 1}`);
      
      await browser.saveScreenshot(`./screenshots/featured-before-swipe-${swipeCount}.png`);
      
      // Try main swipe first
      let swipeSuccess = await this.swipeProductsLeft();
      
      // If main swipe fails, try alternative
      if (!swipeSuccess) {
        console.log("Main swipe failed, trying alternative method...");
        swipeSuccess = await this.swipeProductsLeftAlternative();
      }
      
      if (swipeSuccess) {
        console.log(`✓ Swipe ${swipeCount} completed`);
        await browser.saveScreenshot(`./screenshots/featured-after-swipe-${swipeCount}.png`);
        
        // After swipe, we expect new products to be visible
        // Try multiple indices to find new products
        let productsAddedThisSwipe = 0;
        const indicesToTry = [1, 2, 3, 4]; // Try multiple indices
        
        for (const index of indicesToTry) {
          if (totalAdded >= targetProducts) break;
          
          const productKey = `batch${swipeCount}-product${index}`;
          
          // Skip if we've already added a product at this index in this batch
          if (!addedProducts.has(productKey)) {
            if (await this.addSingleProduct(index)) {
              totalAdded++;
              productsAddedThisSwipe++;
              addedProducts.add(productKey);
              console.log(`✅ Featured product ${totalAdded}/${targetProducts} added after swipe ${swipeCount}`);
              await browser.saveScreenshot(`./screenshots/featured-product-${totalAdded}-added.png`);
              await browser.pause(1500);
              
              // Stop after adding 1-2 products per swipe
              if (productsAddedThisSwipe >= 2) break;
            }
          }
        }
        
        if (productsAddedThisSwipe === 0) {
          console.log("❌ No new products found after swipe");
        }
      } else {
        console.log(`❌ Swipe ${swipeCount} failed`);
      }
      
      await browser.pause(2000);
    }
    
    // If we still don't have 5 products, try adding from current view
    if (totalAdded < targetProducts) {
      console.log(`\n⚠️ Only ${totalAdded} featured products added. Trying to add more from current view...`);
      
      const currentProducts = await this.getVisibleAddButtonCount();
      console.log(`Found ${currentProducts} featured products in current view`);
      
      // Try to add remaining products from any visible index
      for (let i = 1; i <= currentProducts && totalAdded < targetProducts; i++) {
        const finalKey = `final-product${i}`;
        if (!addedProducts.has(finalKey) && await this.addSingleProduct(i)) {
          totalAdded++;
          addedProducts.add(finalKey);
          console.log(`✅ Featured product ${totalAdded}/${targetProducts} added from current view`);
          await browser.saveScreenshot(`./screenshots/featured-product-${totalAdded}-added.png`);
          await browser.pause(1500);
        }
      }
    }
    
    console.log(`\n✅ Total featured products added: ${totalAdded}/${targetProducts}`);
    
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

export default FeaturedProductsPage;