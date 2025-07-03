// src/pages/categories.page.ts
import { BasePage } from './base.page';
import { browser } from '@wdio/globals';
import { SwipeUtils } from '../utils/swipe.utils';

export class CategoriesPage extends BasePage {
  // Tab selectors
  private get categoriesTab() {
    return '//android.widget.ImageView[@content-desc="Categories\nTab 2 of 4"]';
  }

  private get homeTab() {
    return '//android.widget.ImageView[@content-desc="Home\nTab 1 of 4"]';
  }

  // "All" button selector - this is what we click to see all products
  private getAllButtonByIndex(index: number) {
    return `(//android.widget.ImageView[@content-desc="All"])[${index}]`;
  }

  // Generic All button
  private get allButton() {
    return '//android.widget.ImageView[@content-desc="All"]';
  }

  // Subcategory selectors
  private get sunscreenSubcategory() {
    return '//android.widget.ImageView[@content-desc="Sunscreen"]';
  }

  private get masksAndCleansersSubcategory() {
    return '//android.widget.ImageView[@content-desc="Masks and cleansers"]';
  }

  // Add button selector
  private getAddButtonByIndex(index: number) {
    return `(//android.view.View[@content-desc="Add"])[${index}]`;
  }

  // Back button selector
  private get backButton() {
    return '//android.widget.Button';
  }

  // Category title selectors to verify which category we're viewing
  private get skincareCategoryTitle() {
    return '//android.widget.TextView[@text="Skincare"]';
  }

  // Navigation methods
  async navigateToCategories() {
    console.log("Navigating to Categories tab...");
    await browser.pause(2000);
    await this.clickElement(this.categoriesTab);
    await browser.pause(3000);
    console.log("✓ Categories tab opened");
  }

  async navigateToHome(): Promise<boolean> {
    try {
      console.log("Navigating to Home tab...");
      
      const homeTabVisible = await this.isElementExisting(this.homeTab);
      
      if (homeTabVisible) {
        await this.clickElement(this.homeTab);
        await browser.pause(2000);
        console.log("✓ Home tab clicked");
        return true;
      } else {
        console.log("Home tab not visible, trying to go back first");
        await this.goBack();
        await browser.pause(1000);
        
        const homeTabVisibleAfterBack = await this.isElementExisting(this.homeTab);
        if (homeTabVisibleAfterBack) {
          await this.clickElement(this.homeTab);
          await browser.pause(2000);
          console.log("✓ Home tab clicked after going back");
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.log("Failed to navigate to Home tab:", error);
      return false;
    }
  }

  async clickAllButtonForCategory(categoryPosition: number) {
    console.log(`Clicking "All" button for category at position ${categoryPosition}...`);
    
    try {
      const allButtonSelector = this.getAllButtonByIndex(categoryPosition);
      await this.clickElement(allButtonSelector);
      console.log(`✓ "All" button clicked for category ${categoryPosition}`);
      
      // Wait for page transition
      await browser.pause(4000);
      
    } catch (error) {
      console.error(`Failed to click "All" button:`, error);
      throw error;
    }
  }

  async waitForProductsPage(): Promise<boolean> {
    console.log("Waiting for products page to load...");
    
    try {
      // Wait for at least one Add button to appear
      await browser.waitUntil(
        async () => {
          const addButtonExists = await this.isElementExisting('//android.view.View[@content-desc="Add"]');
          return addButtonExists;
        },
        {
          timeout: 10000,
          timeoutMsg: 'Products page did not load - no Add buttons found'
        }
      );
      
      console.log("✓ Products page loaded");
      return true;
    } catch (error) {
      console.error("Products page failed to load:", error);
      return false;
    }
  }

  async addProductFromCategory(productIndex: number = 1): Promise<boolean> {
    try {
      const buttonSelector = this.getAddButtonByIndex(productIndex);
      console.log(`Adding product ${productIndex}...`);
      await this.clickElement(buttonSelector);
      await browser.pause(2000);
      console.log(`✓ Product ${productIndex} added`);
      return true;
    } catch (error) {
      console.log(`Failed to add product ${productIndex}:`, error);
      return false;
    }
  }

  async switchToSubcategory(subcategoryName: string) {
    console.log(`Switching to ${subcategoryName} subcategory...`);
    
    let selector = '';
    switch(subcategoryName) {
      case 'Masks and cleansers':
        selector = this.masksAndCleansersSubcategory;
        break;
      case 'Sunscreen':
        selector = this.sunscreenSubcategory;
        break;
      default:
        selector = `//android.widget.ImageView[@content-desc="${subcategoryName}"]`;
    }
    
    await this.clickElement(selector);
    await browser.pause(3000);
    console.log(`✓ ${subcategoryName} subcategory selected`);
  }

  // FIX FOR LINE 179 - Fixed scrollToFindAllButton method
  async scrollToFindAllButton(targetPosition: number): Promise<boolean> {
    console.log(`Scrolling to find "All" button at position ${targetPosition}...`);
    
    const maxScrolls = 5;
    let scrollCount = 0;
    
    while (scrollCount < maxScrolls) {
      // Check how many "All" buttons are visible
      const allButtonsElements = await browser.$$('//android.widget.ImageView[@content-desc="All"]');
      // Get the actual count by evaluating the length
      const visibleCount: number = await (async () => {
        return allButtonsElements.length;
      })();
      
      console.log(`Found ${visibleCount} "All" buttons on screen`);
      
      if (visibleCount >= targetPosition) {
        console.log(`✓ Target "All" button is visible`);
        return true;
      }
      
      await SwipeUtils.swipeUp(0.4);
      await browser.pause(1000);
      scrollCount++;
    }
    
    console.log(`❌ Could not find "All" button at position ${targetPosition}`);
    return false;
  }

  // Main test flow with fixes
  async testCategoriesFlow(): Promise<number> {
    console.log("\n=== Testing Categories Section ===");
    
    let totalProductsAdded = 0;
    
    try {
      // Navigate to Categories
      await this.navigateToCategories();
      await this.takeScreenshot('categories-01-main-page');
      
      // Test 1: First category (Skincare)
      console.log("\n📦 Testing Skincare Category");
      
      // Click the first "All" button (Skincare)
      await this.clickAllButtonForCategory(1);
      
      // Wait for products page
      const skincareLoaded = await this.waitForProductsPage();
      if (skincareLoaded) {
        await this.takeScreenshot('categories-02-skincare-products');
        
        // Add 1 product
        if (await this.addProductFromCategory(1)) {
          totalProductsAdded++;
          console.log(`Total products added: ${totalProductsAdded}`);
        }
        
        // Scroll and add 2 more products
        await SwipeUtils.swipeUp(0.5);
        await browser.pause(2000);
        
        for (let i = 1; i <= 2; i++) {
          if (await this.addProductFromCategory(i)) {
            totalProductsAdded++;
            console.log(`Total products added: ${totalProductsAdded}`);
            await browser.pause(1500);
          }
        }
        
        // Switch to Masks and cleansers subcategory
        await this.switchToSubcategory('Masks and cleansers');
        await this.takeScreenshot('categories-03-masks-subcategory');
        
        // Add 2 products from subcategory
        for (let i = 1; i <= 2; i++) {
          if (await this.addProductFromCategory(i)) {
            totalProductsAdded++;
            console.log(`Total products added: ${totalProductsAdded}`);
            await browser.pause(1500);
          }
        }
        
        // Go back to categories main
        await this.goBack();
        await browser.pause(2000);
      }
      
      // Test 2: Scroll and find Icecreams category
      console.log("\n📦 Testing Icecreams and Frozen desserts");
      
      // Scroll to find more categories
      await SwipeUtils.swipeUp(0.5);
      await browser.pause(2000);
      
      // FIX FOR LINE 264 - Look for "All" buttons again
      const allButtonsAfterScrollElements = await browser.$$('//android.widget.ImageView[@content-desc="All"]');
      const buttonsCountAfterScroll: number = await (async () => {
        return allButtonsAfterScrollElements.length;
      })();
      console.log(`Found ${buttonsCountAfterScroll} "All" buttons after scroll`);
      
      // Click an "All" button (adjust index based on what's visible)
      if (buttonsCountAfterScroll >= 1) {
        await this.clickAllButtonForCategory(1); // Click first visible "All"
        
        const categoryLoaded = await this.waitForProductsPage();
        if (categoryLoaded) {
          await this.takeScreenshot('categories-04-category-products');
          
          // Add products
          if (await this.addProductFromCategory(1)) {
            totalProductsAdded++;
          }
          
          await SwipeUtils.swipeUp(0.5);
          await browser.pause(2000);
          
          for (let i = 1; i <= 2; i++) {
            if (await this.addProductFromCategory(i)) {
              totalProductsAdded++;
              await browser.pause(1500);
            }
          }
          
          await this.goBack();
          await browser.pause(2000);
        }
      }
      
      // Test 3: One more category
      console.log("\n📦 Testing another category");
      
      // Scroll again if needed
      await SwipeUtils.swipeUp(0.4);
      await browser.pause(2000);
      
      // FIX FOR LINE 302 - Click another "All" button
      const finalAllButtonsElements = await browser.$$('//android.widget.ImageView[@content-desc="All"]');
      const finalButtonsCount: number = await (async () => {
        return finalAllButtonsElements.length;
      })();
      
      if (finalButtonsCount >= 1) {
        await this.clickAllButtonForCategory(1);
        
        const finalCategoryLoaded = await this.waitForProductsPage();
        if (finalCategoryLoaded) {
          await this.takeScreenshot('categories-05-final-products');
          
          // Add products
          if (await this.addProductFromCategory(1)) {
            totalProductsAdded++;
          }
          
          await SwipeUtils.swipeUp(0.5);
          await browser.pause(2000);
          
          for (let i = 1; i <= 2; i++) {
            if (await this.addProductFromCategory(i)) {
              totalProductsAdded++;
              await browser.pause(1500);
            }
          }
          
          await this.goBack();
          await browser.pause(2000);
        }
      }
      
      // Return to home
      console.log("\n📱 Returning to Home page");
      await this.navigateToHome();
      await this.takeScreenshot('categories-06-back-to-home');
      
      console.log(`\n✅ Categories test completed. Total products added: ${totalProductsAdded}`);
      return totalProductsAdded;
      
    } catch (error) {
      console.error("Error in categories flow:", error);
      await this.takeScreenshot('categories-error');
      
      // Try to recover and go back to home
      try {
        await this.navigateToHome();
      } catch (recoveryError) {
        console.log("Failed to navigate home during recovery");
      }
      
      throw error;
    }
  }

  // Keep existing compatibility method
  async addProductsFromMultipleCategories(): Promise<number> {
    return await this.testCategoriesFlow();
  }

  // Helper method to go back from product page
  async goBackFromProductPage() {
    console.log("Going back from product page...");
    
    const wentBack = await this.goBack();
    
    if (wentBack) {
            console.log("✓ Successfully went back from product page");
    } else {
      console.log("❌ Failed to go back from product page");
    }
  }

  // Helper method to go back to main categories
  async goBackToMainCategories() {
    console.log("Ensuring we're back at main categories page...");
    
    // Check if we're already on categories page by looking for All buttons
    const categoriesVisible = await this.isElementExisting(this.allButton);
    
    if (!categoriesVisible) {
      // We might be in a product page, go back
      await this.goBackFromProductPage();
      await browser.pause(1000);
    }
    
    console.log("✓ At main categories page");
  }

  // Alternative helper method to count All buttons safely
  private async countAllButtons(): Promise<number> {
    try {
      const elements = await browser.$$('//android.widget.ImageView[@content-desc="All"]');
      // Explicitly handle the length
      if (Array.isArray(elements)) {
        return elements.length;
      }
      // If it's not an array, try to get length property
      return (elements as any).length || 0;
    } catch (error) {
      console.log("Error counting All buttons:", error);
      return 0;
    }
  }

  // Additional helper method for better type safety
  private async getElementsCount(selector: string): Promise<number> {
    try {
      const elements = await browser.$$(selector);
      return elements.length;
    } catch (error) {
      return 0;
    }
  }
}