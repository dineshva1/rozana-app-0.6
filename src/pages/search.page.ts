// src/pages/search.page.ts
import { $ } from "@wdio/globals";
import { BasePage } from "./base.page";
import { browser } from "@wdio/globals";

export class SearchPage extends BasePage {
  private readonly searchItems = ["oil", "sugar", "biscuit", "soap"];
  
  // Updated selectors for new UI
  private readonly searchBarHomeSelector = '//android.view.View[@content-desc="Search for Store / Groceries & Essentials....."]';
  private readonly searchInputSelector = 'android.widget.EditText';
  private readonly clearSearchButtonSelector = '~Clear';
  private readonly goBackButtonSelector = '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View[1]/android.widget.Button';
  private readonly addButtonSelector = '//android.view.View[@content-desc="Add"]';
  
  get searchBarHome() {
    return $(this.searchBarHomeSelector);
  }
  
  get searchInput() {
    return $(this.searchInputSelector);
  }
  
  get clearSearchButton() {
    return $(this.clearSearchButtonSelector);
  }
  
  get goBackButton() {
    return $(this.goBackButtonSelector);
  }
  
  getFirstAddButton() {
    return $(`(${this.addButtonSelector})[1]`);
  }
  
  async clickSearchBarFromHome() {
    console.log("Clicking on search bar from home page...");
    await this.waitForElement(this.searchBarHomeSelector);
    const searchBar = await this.searchBarHome;
    await searchBar.click();
    await browser.pause(1500);
  }
  
  async enterSearchText(text: string) {
    console.log(`Entering search text: ${text}`);
    await this.waitForElement(this.searchInputSelector);
    const searchInput = await this.searchInput;
    await searchInput.clearValue();
    await searchInput.setValue(text);
    await browser.pause(1000);
  }
  
  async pressEnterKey() {
    console.log("Pressing Enter key...");
    await browser.pressKeyCode(66); // 66 is the key code for Enter
    await browser.pause(2500); // Wait for search results
  }
  
  async selectFirstProduct() {
    console.log("Looking for Add button...");
    
    try {
      // Wait a bit for results to load
      await browser.pause(1000);
      
      // Try to find the first Add button
      const addButton = await this.getFirstAddButton();
      
      if (await addButton.isExisting() && await addButton.isDisplayed()) {
        await addButton.click();
        console.log("✓ First product added");
        await browser.pause(1500);
        return true;
      } else {
        console.log("⚠️ Add button not found for first product");
        return false;
      }
    } catch (error) {
      console.log("⚠️ Could not find add button for this search:", error);
      return false;
    }
  }
  
  async clearSearchField() {
    console.log("Clearing search field...");
    const searchInput = await this.searchInput;
    await searchInput.click();
    await browser.pause(500);
    
    // Clear the value
    await searchInput.clearValue();
    await browser.pause(500);
  }
  
  async searchAndAddProducts() {
    let successfulAdds = 0;
    
    try {
      // Click on search bar from home page
      await this.clickSearchBarFromHome();
      await browser.saveScreenshot('./screenshots/search-01-search-bar-clicked.png');
      
      // Process each search item
      for (let i = 0; i < this.searchItems.length; i++) {
        const item = this.searchItems[i];
        console.log(`\n--- Searching for item ${i + 1}: ${item} ---`);
        
        // Enter search text
        await this.enterSearchText(item);
        await browser.saveScreenshot(`./screenshots/search-02-entered-${item}.png`);
        
        // Press Enter to search
        await this.pressEnterKey();
        await browser.saveScreenshot(`./screenshots/search-03-results-${item}.png`);
        
        // Select first product
        const added = await this.selectFirstProduct();
        if (added) {
          successfulAdds++;
          await browser.saveScreenshot(`./screenshots/search-04-added-${item}.png`);
        }
        
        // Clear search for next item (except for last item)
        if (i < this.searchItems.length - 1) {
          await this.clearSearchField();
        }
      }
      
      console.log(`\n✓ Successfully added ${successfulAdds} out of ${this.searchItems.length} items`);
      
      // Go back to home page
      await this.goBackFromSearch();
      
      return successfulAdds;
      
    } catch (error) {
      console.error("Error in search and add products:", error);
      await browser.saveScreenshot('./screenshots/search-error.png');
      
      // Try to recover
      try {
        await this.goBackFromSearch();
      } catch (recoveryError) {
        console.log("Recovery failed:", recoveryError);
      }
      
      throw error;
    }
  }
  
  async goBackFromSearch() {
    console.log("\nGoing back from search...");
    
    try {
      // Use the specific go back button selector
      await this.waitForElement(this.goBackButtonSelector, 5000);
      const goBackBtn = await this.goBackButton;
      
      if (await goBackBtn.isExisting() && await goBackBtn.isDisplayed()) {
        await goBackBtn.click();
        console.log("✓ Clicked go back button");
        await browser.pause(2000);
      } else {
        // Alternative: Use device back button
        console.log("Go back button not found, using device back button");
        await browser.back();
        await browser.pause(2000);
      }
    } catch (error) {
      console.log("Error with go back button, using device back button:", error);
      await browser.back();
      await browser.pause(2000);
    }
  }
}