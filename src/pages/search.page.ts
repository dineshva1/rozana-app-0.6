import { $ } from "@wdio/globals";
import { BasePage } from "./base.page";

export class SearchPage extends BasePage {
  private readonly searchItems = ["oil", "sugar", "biscuit", "soap"];
  
  // Selectors as strings
  private readonly searchBarSelector = 'android.widget.EditText';
  private readonly clearSearchButtonSelector = '//android.widget.EditText/../android.widget.Button';
  private readonly goBackButtonSelector = '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.view.View[1]/android.widget.Button';
  private readonly firstAddButtonSelector = 'android=new UiSelector().description("+").instance(0)';
  
  get searchBar() {
    return $(this.searchBarSelector);
  }
  
  get clearSearchButton() {
    return $(this.clearSearchButtonSelector);
  }
  
  get goBackButton() {
    return $(this.goBackButtonSelector);
  }
  
  getFirstAddButton() {
    return $(this.firstAddButtonSelector);
  }
  
  async clickSearchBar() {
    console.log("Clicking on search bar...");
    await this.waitForElement(this.searchBarSelector);
    const searchBar = await this.searchBar;
    await searchBar.click();
    await browser.pause(1500);
  }
  
  async enterSearchText(text: string) {
    console.log(`Entering search text: ${text}`);
    const searchBar = await this.searchBar;
    await searchBar.clearValue();
    await searchBar.setValue(text);
    await browser.pause(1000);
  }
  
  async pressEnterKey() {
    console.log("Pressing Enter key...");
    await browser.pressKeyCode(66); // 66 is the key code for Enter
    await browser.pause(2000); // Wait for search results
  }
  
  async selectFirstProduct() {
    console.log("Selecting first product...");
    
    try {
      // Wait for the add button to be present
      await this.waitForElement(this.firstAddButtonSelector);
      const addButton = await this.getFirstAddButton();
      
      if (await addButton.isExisting()) {
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
  
  async clearSearch() {
    console.log("Clearing search...");
    const searchBar = await this.searchBar;
    await searchBar.click();
    await searchBar.clearValue();
    await browser.pause(500);
  }
  
  async searchAndAddProducts() {
    let successfulAdds = 0;
    
    try {
      // Click on search bar
      await this.clickSearchBar();
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
          await this.clearSearch();
        }
      }
      
      console.log(`\n✓ Successfully added ${successfulAdds} out of ${this.searchItems.length} items`);
      
      // Go back to home page
      await this.goBackFromSearch();
      
      return successfulAdds;
      
    } catch (error) {
      console.error("Error in search and add products:", error);
      await browser.saveScreenshot('./screenshots/search-error.png');
      throw error;
    }
  }
  
  async goBackFromSearch() {
    console.log("\nGoing back from search...");
    
    try {
      // First try the go back button
      const goBackBtn = await this.goBackButton;
      if (await goBackBtn.isExisting()) {
        await goBackBtn.click();
        console.log("✓ Clicked go back button");
        await browser.pause(2000);
      } else {
        // Alternative: Use device back button
        await browser.back();
        console.log("✓ Used device back button");
        await browser.pause(2000);
      }
    } catch (error) {
      console.log("Error going back, trying device back button:", error);
      await browser.back();
      await browser.pause(2000);
    }
  }
}