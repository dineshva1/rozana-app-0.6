// src/pages/home.page.ts
import { BasePage } from './base.page';
import { browser } from '@wdio/globals';

export class HomePage extends BasePage {
  // Updated selectors for new UI (Tab 1 of 4 instead of Tab 1 of 5)
  private get searchBar() { 
    return '//android.view.View[@content-desc="Search for Store / Groceries & Essentials....."]'; 
  }
  
  private get homeTab() { 
    return '//android.widget.ImageView[@content-desc="Home Tab 1 of 4"]'; 
  }
  
  private get categoriesTab() {
    return '//android.widget.ImageView[@content-desc="Categories Tab 2 of 4"]';
  }
  
  private get profileTab() {
    return '//android.widget.ImageView[@content-desc="Profile Tab 4 of 4"]';
  }
  
  // Keep existing methods unchanged
  async isHomePageDisplayed(): Promise<boolean> {
    try {
      console.log("Checking if home page is displayed...");
      
      // Primary check - search bar
      const searchBarExists = await this.isElementExisting(this.searchBar);
      console.log(`Search bar exists: ${searchBarExists}`);
      
      if (searchBarExists) {
        return true;
      }
      
      // Secondary check - home tab
      const homeTabExists = await this.isElementExisting(this.homeTab);
      console.log(`Home tab exists: ${homeTabExists}`);
      
      return homeTabExists;
    } catch (error) {
      console.error('Error checking home page:', error);
      return false;
    }
  }
  
  async waitForHomePageToLoad() {
    console.log("Waiting for home page to load...");
    await browser.pause(2000);
    
    await browser.waitUntil(
      async () => await this.isHomePageDisplayed(),
      {
        timeout: 15000,
        timeoutMsg: 'Home page did not load within 15 seconds'
      }
    );
    
    console.log("Home page loaded successfully");
  }
}