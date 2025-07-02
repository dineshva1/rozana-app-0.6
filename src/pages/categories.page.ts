import { BasePage } from './base.page';
import { browser } from '@wdio/globals';
import { SwipeUtils } from '../utils/swipe.utils';

export class CategoriesPage extends BasePage {
  // Tab selectors
  private get categoriesTab() {
    return '//android.widget.Button[@content-desc="Categories\nTab 2 of 5"]';
  }

  // Add home tab selector
  private get homeTab() {
    return '//android.widget.Button[@content-desc="Home\nTab 1 of 5"]';
  }

  // Category selectors
  private get skincareCategory() {
    return '//android.view.View[@content-desc="Skincare"]';
  }

  private get mobilesAndElectronicsCategory() {
    return '//android.view.View[@content-desc="Mobiles and Electronics"]';
  }

  private get icecreamsCategory() {
    return '//android.view.View[@content-desc="Kitchen and Dining"]';
  }

  // View All buttons with specific indices
  private getViewAllButtonByIndex(index: number) {
    return `(//android.widget.Button[@content-desc="View All"])[${index}]`;
  }

  // Subcategory selectors for Skincare
  private get sunscreenSubcategory() {
    return '//android.widget.ImageView[@content-desc="Sunscreen"]';
  }

  // Product selectors
  private getAddButtonByIndex(index: number) {
    return `(//android.widget.Button[@content-desc="+"])[${index}]`;
  }

  // Back button selectors - multiple options
  private get backButton() {
    // Try a simpler selector first
    return '(//android.widget.Button)[1]';
  }

  private get backButtonAlternative() {
    // Alternative back button selector
    return '//android.view.View[1]/android.widget.Button[1]';
  }

  // Page title selector to verify we're on the right page
  private get pageTitle() {
    return '//android.widget.TextView';
  }

  // Navigation methods
  async navigateToCategories() {
    console.log("Navigating to Categories tab...");
    await browser.pause(2000);
    await this.clickElement(this.categoriesTab);
    await browser.pause(3000);
    console.log("✓ Categories tab opened");
  }

  // Navigate to home tab
  async navigateToHome(): Promise<boolean> {
    try {
      console.log("Navigating to Home tab...");
      
      // First check if home tab is visible
      const homeTabVisible = await this.isElementExisting(this.homeTab);
      
      if (homeTabVisible) {
        await this.clickElement(this.homeTab);
        await browser.pause(2000);
        console.log("✓ Home tab clicked");
        return true;
      } else {
        console.log("Home tab not visible, trying to go back first");
        // If not visible, we might be in a full-screen view
        await this.goBack();
        await browser.pause(1000);
        
        // Try again
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

  // Go back method with multiple strategies
  async goBack(): Promise<boolean> {
    try {
      console.log("Attempting to go back...");
      
      // Strategy 1: Try the primary back button selector
      const backButtonVisible = await this.isElementExisting(this.backButton);
      
      if (backButtonVisible) {
        console.log("Back button found with primary selector");
        await this.clickElement(this.backButton);
        await browser.pause(2000);
        console.log("✓ Back button clicked");
        return true;
      }
      
      // Strategy 2: Try alternative back button selector
      const altBackButtonVisible = await this.isElementExisting(this.backButtonAlternative);
      
      if (altBackButtonVisible) {
        console.log("Back button found with alternative selector");
        await this.clickElement(this.backButtonAlternative);
        await browser.pause(2000);
        console.log("✓ Alternative back button clicked");
        return true;
      }
      
      // Strategy 3: Try Android system back
      console.log("No back button found, using Android system back");
      await browser.back();
      await browser.pause(2000);
      console.log("✓ Android system back pressed");
      return true;
      
    } catch (error) {
      console.log("Failed to go back:", error);
      
      // Last resort: Try Android system back anyway
      try {
        await browser.back();
        await browser.pause(1000);
        return true;
      } catch (backError) {
        console.log("Android system back also failed:", backError);
        return false;
      }
    }
  }

  async clickViewAllForCategory(categoryName: string) {
    console.log(`Looking for View All button for ${categoryName}...`);
    
    // Wait a bit for all View All buttons to load
    await browser.pause(1500);
    
    // Find all View All buttons
    const viewAllButtons = await browser.$$('//android.widget.Button[@content-desc="View All"]');
    console.log(`Found ${viewAllButtons.length} View All buttons on screen`);
    
    // Based on category position, determine which View All to click
    let buttonIndex = 1; // default
    
    // Check which categories are visible to determine the correct index
    const skincareVisible = await this.isElementExisting(this.skincareCategory);
    const mobilesVisible = await this.isElementExisting(this.mobilesAndElectronicsCategory);
    const icecreamsVisible = await this.isElementExisting(this.icecreamsCategory);
    
    if (categoryName === 'Skincare' && skincareVisible) {
      buttonIndex = 1; // First View All
    } else if (categoryName === 'Mobiles and Electronics' && mobilesVisible) {
      // If Skincare is also visible, Mobiles is second, otherwise first
      buttonIndex = skincareVisible ? 2 : 1;
    } else if (categoryName === 'Kitchen and Dining' && icecreamsVisible) {
      // Count how many categories are above Kitchen and Dining
      let indexCount = 1;
      if (skincareVisible) indexCount++;
      if (mobilesVisible) indexCount++;
      buttonIndex = indexCount;
    }
    
    console.log(`Clicking View All button at index ${buttonIndex} for ${categoryName}`);
    const viewAllSelector = this.getViewAllButtonByIndex(buttonIndex);
    
    await this.clickElement(viewAllSelector);
    await browser.pause(3000);
    console.log(`✓ View All clicked for ${categoryName} - products page opened`);
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

  async switchToSunscreenSubcategory() {
    console.log("Switching to Sunscreen subcategory...");
    await this.clickElement(this.sunscreenSubcategory);
    await browser.pause(3000);
    console.log("✓ Sunscreen subcategory selected");
  }

  async addProductWithSwipeUp(): Promise<boolean> {
    console.log("Adding product after swipe up...");
    
    // First swipe up to see more products
    await SwipeUtils.swipeUp(0.5);
    await browser.pause(2000);
    
    // Try to add the first visible product
    const added = await this.addProductFromCategory(1);
    if (!added) {
      // Try second product if first fails
      return await this.addProductFromCategory(2);
    }
    return added;
  }

  async goBackFromProductPage() {
    console.log("Going back from product page...");
    
    // Use the more robust goBack method
    const wentBack = await this.goBack();
    
    if (wentBack) {
      console.log("✓ Successfully went back from product page");
    } else {
      console.log("❌ Failed to go back from product page");
    }
  }

  async goBackToMainCategories() {
    console.log("Ensuring we're back at main categories page...");
    
    // Check if we're already on categories page
    const categoriesVisible = await this.isElementExisting(this.skincareCategory) || 
                            await this.isElementExisting(this.mobilesAndElectronicsCategory);
    
    if (!categoriesVisible) {
      // We might be in a product page, go back
      await this.goBackFromProductPage();
      await browser.pause(1000);
    }
    
    console.log("✓ At main categories page");
  }

  async scrollToFindCategory(categoryName: string): Promise<string | null> {
    console.log(`Scrolling to find ${categoryName} category...`);
    
    const maxScrolls = 5;
    let scrollCount = 0;
    
    while (scrollCount < maxScrolls) {
      // Check if the category is visible
      let selector = '';
      if (categoryName === 'Mobiles and Electronics') {
        selector = this.mobilesAndElectronicsCategory;
      } else if (categoryName === 'Kitchen and Dining') {
        selector = this.icecreamsCategory;
      } else if (categoryName === 'Skincare') {
        selector = this.skincareCategory;
      } else {
        selector = `//android.view.View[@content-desc="${categoryName}"]`;
      }
      
      const isVisible = await this.isElementExisting(selector);
      if (isVisible) {
        console.log(`✓ ${categoryName} category found`);
        return selector;
      }
      
      await SwipeUtils.swipeUp(0.4);
      await browser.pause(1000);
      scrollCount++;
    }
    
    console.log(`❌ ${categoryName} category not found after scrolling`);
    return null;
  }

  async selectCategory(categoryName: string): Promise<boolean> {
    // First check if category is already visible
    let selector = '';
    if (categoryName === 'Skincare') {
      selector = this.skincareCategory;
    } else if (categoryName === 'Mobiles and Electronics') {
      selector = this.mobilesAndElectronicsCategory;
    } else if (categoryName === 'Kitchen and Dining') {
      selector = this.icecreamsCategory;
    }

    let isVisible = await this.isElementExisting(selector);
    
    if (!isVisible) {
      // If not visible, scroll to find it
      const foundSelector = await this.scrollToFindCategory(categoryName);
      if (!foundSelector) {
        return false;
      }
      selector = foundSelector;
    }

    await this.clickElement(selector);
    await browser.pause(2000);
    console.log(`✓ ${categoryName} category selected`);
    return true;
  }

  // Main flow for adding products from categories
  async addProductsFromMultipleCategories(): Promise<number> {
    console.log("\n=== Adding Products from Multiple Categories ===");
    
    let totalProductsAdded = 0;
    
    try {
      // Navigate to Categories
      await this.navigateToCategories();
      await browser.saveScreenshot('./screenshots/categories-01-main-page.png');
      
      // Category 1: Skincare
      console.log("\n📦 Category 1: Skincare");
      const foundSkincare = await this.selectCategory('Skincare');
      
      if (foundSkincare) {
        await this.clickViewAllForCategory('Skincare');
        await browser.saveScreenshot('./screenshots/categories-02-skincare-products.png');
        
        // Add first product from default subcategory
        if (await this.addProductFromCategory(1)) {
          totalProductsAdded++;
          console.log(`Total products added: ${totalProductsAdded}`);
        }
        
        // Switch to Sunscreen subcategory
        await this.switchToSunscreenSubcategory();
        await browser.saveScreenshot('./screenshots/categories-03-sunscreen-subcategory.png');
        
        // Add one product normally
        if (await this.addProductFromCategory(1)) {
          totalProductsAdded++;
          console.log(`Total products added: ${totalProductsAdded}`);
        }
        
        // Add another product after swiping
        if (await this.addProductWithSwipeUp()) {
          totalProductsAdded++;
          console.log(`Total products added: ${totalProductsAdded}`);
        }
        
        // Go back to categories main page
        await this.goBackFromProductPage();
        await this.goBackToMainCategories();
      }
      
      // Category 2: Mobiles and Electronics
      console.log("\n📦 Category 2: Mobiles and Electronics");
      await browser.pause(2000);
      const foundMobiles = await this.selectCategory('Mobiles and Electronics');
      
      if (foundMobiles) {
        await browser.pause(2000);
        await this.clickViewAllForCategory('Mobiles and Electronics');
        await browser.saveScreenshot('./screenshots/categories-04-mobiles-products.png');
        
        // Add 2 products
        for (let i = 1; i <= 2; i++) {
          if (await this.addProductFromCategory(i)) {
            totalProductsAdded++;
            console.log(`Total products added: ${totalProductsAdded}`);
            await browser.pause(1500);
          }
        }
        
        // Go back to categories main page
        await this.goBackFromProductPage();
        await this.goBackToMainCategories();
      }
      
      // Category 3: Kitchen and Dining
      console.log("\n📦 Category 3: Kitchen and Dining");
      await browser.pause(2000);
      const foundIcecreams = await this.selectCategory('Kitchen and Dining');
      
      if (foundIcecreams) {
        await browser.pause(2000);
        await this.clickViewAllForCategory('Kitchen and Dining');
        await browser.saveScreenshot('./screenshots/categories-05-icecreams-products.png');
        
        // Add 2 products
        for (let i = 1; i <= 2; i++) {
          if (await this.addProductFromCategory(i)) {
            totalProductsAdded++;
            console.log(`Total products added: ${totalProductsAdded}`);
            await browser.pause(1500);
          }
        }
        
        // Try one more with swipe if needed
        if (totalProductsAdded < 8 && await this.addProductWithSwipeUp()) {
          totalProductsAdded++;
          console.log(`Total products added: ${totalProductsAdded}`);
        }
        
        // Go back for final navigation
        await this.goBackFromProductPage();
      }
      
      console.log(`\n✅ Added ${totalProductsAdded} products from categories`);
      await browser.saveScreenshot('./screenshots/categories-06-final.png');
      return totalProductsAdded;
      
    } catch (error) {
      console.error("Error in categories flow:", error);
      await browser.saveScreenshot('./screenshots/categories-error.png');
      throw error;
    }
  }
}