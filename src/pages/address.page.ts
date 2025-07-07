// src/pages/address.page.ts
import { BasePage } from './base.page';
import { browser } from '@wdio/globals';

export class AddressPage extends BasePage {
  // Location button on home page
  private get locationButton() {
    return '//android.widget.ImageView[contains(@content-desc, "Current - Deliver in")]';
  }
  
  // My Addresses page elements
  private get myAddressesTitle() {
    return '//android.view.View[@content-desc="My Addresses"]';
  }
  
  private get addAddressButton() {
    return '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.widget.Button[2]';
  }
  
  private get addAddressButtonAlt() {
    return 'android=new UiSelector().className("android.widget.Button").instance(2)';
  }
  
  private get backButton() {
    return '//android.widget.Button[@content-desc="Back"]';
  }
  
  // Select Location page elements
  private get searchLocationInput() {
    return '//android.widget.EditText';
  }
  
  private get confirmLocationButton() {
    return '//android.widget.Button[@content-desc="Confirm Location"]';
  }
  
  // Address type selectors
  private get homeAddressType() {
    return '//android.view.View[@content-desc="Home"]';
  }
  
  private get workAddressType() {
    return '//android.view.View[@content-desc="Work"]';
  }
  
  private get otherAddressType() {
    return '//android.view.View[@content-desc="Other"]';
  }
  
  // Add Address Details page
  private get selectLocationOnMapButton() {
    return '//android.widget.Button[@content-desc="Select Location on Map"]';
  }
  
  private get saveAddressButton() {
    return '//android.widget.Button[@content-desc="Save Address"]';
  }
  
  // Address results
  private getAddressResult(text: string) {
    return `//android.widget.Button[contains(@content-desc, "${text}")]`;
  }
  
  // Click location on home page
  async clickLocationOnHomePage(): Promise<boolean> {
    console.log("\n=== Clicking location on home page ===");
    
    try {
      const locationBtn = await browser.$(this.locationButton);
      
      if (await locationBtn.isExisting()) {
        const locationText = await locationBtn.getAttribute('content-desc');
        console.log(`Current location: ${locationText}`);
        
        await locationBtn.click();
        console.log("✓ Location clicked");
        await browser.pause(2000);
        return true;
      }
      
      console.log("Location button not found");
      return false;
      
    } catch (error) {
      console.error("Failed to click location:", error);
      return false;
    }
  }
  
  // Wait for My Addresses page
  async waitForMyAddressesPage(): Promise<boolean> {
    console.log("Waiting for My Addresses page...");
    
    let attempts = 10;
    while (attempts > 0) {
      const title = await browser.$(this.myAddressesTitle);
      if (await title.isExisting()) {
        console.log("✓ My Addresses page loaded");
        return true;
      }
      
      await browser.pause(1000);
      attempts--;
    }
    
    console.log("My Addresses page not loaded");
    return false;
  }
  
  // Click Add Address button
// Update the clickAddAddress method in address.page.ts

// Update the clickAddAddress method in address.page.ts

// async clickAddAddress(): Promise<boolean> {
//   console.log("\nClicking Add Address button...");
  
//   try {
//     // Check if we already have addresses (different selector needed)
//     const addressCards = await browser.$$('//android.view.View[contains(@content-desc, "HOME") or contains(@content-desc, "WORK") or contains(@content-desc, "OTHER")]');
//     const addressCount = await addressCards.length; // Fix: await the length
//     const hasAddresses = addressCount > 0;
    
//     let addBtn;
    
//     if (hasAddresses) {
//       // When addresses exist, use the floating action button (pink + button)
//       console.log(`Addresses exist (${addressCount} found), looking for floating action button...`);
      
//       // Try the correct selectors for the pink + button
//       const floatingButtonSelectors = [
//         'android=new UiSelector().className("android.widget.Button").instance(3)',
//         '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.widget.Button[last()]',
//         '//android.widget.Button[@resource-id="com.rozana:id/fab"]',
//         '//android.widget.Button[contains(@resource-id, "fab")]',
//         '//android.widget.Button[contains(@resource-id, "floatingActionButton")]',
//         '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.widget.Button'
//       ];
      
//       for (const selector of floatingButtonSelectors) {
//         try {
//           addBtn = await browser.$(selector);
//           if (await addBtn.isExisting()) {
//             console.log(`Found add button with selector: ${selector}`);
//             break;
//           }
//         } catch (e) {
//           // Continue to next selector
//         }
//       }
//     } else {
//       // When no addresses exist, use the original selectors
//       console.log("No addresses yet, looking for Add New Address button...");
      
//       const initialButtonSelectors = [
//         '//android.widget.Button[@content-desc="Add New Address"]',
//         this.addAddressButton,
//         this.addAddressButtonAlt
//       ];
      
//       for (const selector of initialButtonSelectors) {
//         try {
//           addBtn = await browser.$(selector);
//           if (await addBtn.isExisting()) {
//             console.log(`Found add button with selector: ${selector}`);
//             break;
//           }
//         } catch (e) {
//           // Continue to next selector
//         }
//       }
//     }
    
//     if (addBtn && await addBtn.isExisting()) {
//       await addBtn.click();
//       console.log("✓ Add Address button clicked");
//       await browser.pause(3000);
//       return true;
//     }
    
//     console.log("Add Address button not found");
//     await this.takeScreenshot('add-button-not-found');
//     return false;
    
//   } catch (error) {
//     console.error("Failed to click Add Address:", error);
//     return false;
//   }
// }
  
  // Search and select location
  async searchAndSelectLocation(searchText: string, resultText: string): Promise<boolean> {
    console.log(`\nSearching for location: ${searchText}`);
    
    try {
      // Wait for search input
      const searchInput = await browser.$(this.searchLocationInput);
      await searchInput.waitForDisplayed({ timeout: 10000 });
      
      // Enter search text
      await searchInput.click();
      await browser.pause(500);
      await searchInput.setValue(searchText);
      console.log(`✓ Entered search text: ${searchText}`);
      await browser.pause(2000); // Wait for results
      
      // Select result
      const resultSelector = this.getAddressResult(resultText);
      const resultBtn = await browser.$(resultSelector);
      
      if (await resultBtn.isExisting()) {
        await resultBtn.click();
        console.log(`✓ Selected: ${resultText}`);
        await browser.pause(2000);
        return true;
      }
      
      // Try clicking first result if specific not found
      const firstResult = await browser.$('//android.widget.Button[contains(@content-desc, ",")]');
      if (await firstResult.isExisting()) {
        await firstResult.click();
        console.log("✓ Selected first result");
        await browser.pause(2000);
        return true;
      }
      
      console.log("No results found");
      return false;
      
    } catch (error) {
      console.error("Failed to search location:", error);
      return false;
    }
  }
  
  // Click Confirm Location
  async confirmLocation(): Promise<boolean> {
    console.log("Clicking Confirm Location...");
    
    try {
      const confirmBtn = await browser.$(this.confirmLocationButton);
      
      if (await confirmBtn.isExisting()) {
        await confirmBtn.click();
        console.log("✓ Location confirmed");
        await browser.pause(2000);
        return true;
      }
      
      console.log("Confirm Location button not found");
      return false;
      
    } catch (error) {
      console.error("Failed to confirm location:", error);
      return false;
    }
  }
  
  // Select address type
  async selectAddressType(type: 'home' | 'work' | 'other'): Promise<boolean> {
    console.log(`\nSelecting address type: ${type.toUpperCase()}`);
    
    try {
      let typeSelector;
      
      switch(type) {
        case 'home':
          typeSelector = this.homeAddressType;
          break;
        case 'work':
          typeSelector = this.workAddressType;
          break;
        case 'other':
          typeSelector = this.otherAddressType;
          break;
      }
      
      const typeBtn = await browser.$(typeSelector);
      
      // Check if already selected
      const isSelected = await typeBtn.getAttribute('selected');
      if (isSelected === 'true') {
        console.log(`✓ ${type.toUpperCase()} already selected`);
        return true;
      }
      
      if (await typeBtn.isExisting()) {
        await typeBtn.click();
        console.log(`✓ ${type.toUpperCase()} selected`);
        await browser.pause(1000);
        return true;
      }
      
      console.log(`${type} type button not found`);
      return false;
      
    } catch (error) {
      console.error(`Failed to select ${type}:`, error);
      return false;
    }
  }
  
  // Click Select Location on Map
  async clickSelectLocationOnMap(): Promise<boolean> {
    console.log("Clicking Select Location on Map...");
    
    try {
      const mapBtn = await browser.$(this.selectLocationOnMapButton);
      
      if (await mapBtn.isExisting()) {
        await mapBtn.click();
        console.log("✓ Select Location on Map clicked");
        await browser.pause(3000);
        return true;
      }
      
      console.log("Select Location on Map button not found");
      return false;
      
    } catch (error) {
      console.error("Failed to click map button:", error);
      return false;
    }
  }
  
  // Save address with swipe
  async saveAddress(): Promise<boolean> {
    console.log("\nSaving address...");
    
    try {
      // First try without swipe
      let saveBtn = await browser.$(this.saveAddressButton);
      
      if (!await saveBtn.isDisplayed()) {
        console.log("Save button not visible, swiping up...");
        await this.swipeUp();
        await browser.pause(1500);
      }
      
      saveBtn = await browser.$(this.saveAddressButton);
      
      if (await saveBtn.isExisting() && await saveBtn.isDisplayed()) {
        await saveBtn.click();
        console.log("✓ Address saved");
        await browser.pause(3000);
        return true;
      }
      
      console.log("Save Address button not found");
      return false;
      
    } catch (error) {
      console.error("Failed to save address:", error);
      return false;
    }
  }
  
  // Swipe up helper
  async swipeUp() {
    console.log("Swiping up...");
    
    try {
      const { width, height } = await browser.getWindowSize();
      
      await browser.action('pointer')
        .move({ duration: 0, x: width * 0.5, y: height * 0.7 })
        .down({ button: 0 })
        .move({ duration: 1000, x: width * 0.5, y: height * 0.3 })
        .up({ button: 0 })
        .perform();
      
      await browser.pause(1000);
      
    } catch (error) {
      console.error("Error during swipe:", error);
    }
  }
  
  // Add complete address flow
// Update the addCompleteAddress method to add debugging

async addCompleteAddress(searchText: string, resultText: string, addressType: 'home' | 'work' | 'other', useMapSelection: boolean = false): Promise<boolean> {
  console.log(`\n=== Adding ${addressType.toUpperCase()} address ===`);
  
  try {
    // Debug the page before clicking
    await this.debugAddressPage();
    
    // Try to click Add Address button
    let addClicked = await this.clickAddAddress();
    
    // If failed, try coordinate-based click as fallback
    if (!addClicked) {
      console.log("Standard click failed, trying coordinate-based click...");
      addClicked = await this.clickFloatingActionButton();
    }
    
    if (!addClicked) {
      console.log("Failed to click add address button");
      return false;
    }
    
    // Search and select location
    if (!await this.searchAndSelectLocation(searchText, resultText)) {
      return false;
    }
    
    // Confirm location
    if (!await this.confirmLocation()) {
      return false;
    }
    
    // Wait for Add Address Details page
    await browser.pause(2000);
    
    // Select address type (if not home)
    if (addressType !== 'home') {
      await this.selectAddressType(addressType);
    }
    
    // Click Select Location on Map if needed
    if (useMapSelection) {
      if (await this.clickSelectLocationOnMap()) {
        // Confirm location again after map
        await this.confirmLocation();
      }
    }
    
    // Save address
    if (!await this.saveAddress()) {
      return false;
    }
    
    console.log(`✅ ${addressType.toUpperCase()} address added successfully`);
    return true; // Success return statement
    
  } catch (error) {
    console.error(`Failed to add ${addressType} address:`, error);
    return false;
  }
}
  
  // Go back to home
  async goBackToHome(): Promise<boolean> {
    console.log("\n=== Going back to home page ===");
    
    try {
      const backBtn = await browser.$(this.backButton);
      
      if (await backBtn.isExisting()) {
        await backBtn.click();
        console.log("✓ Back button clicked");
        await browser.pause(2000);
        return true;
      }
      
      // Try device back
      await browser.back();
      console.log("✓ Used device back");
      await browser.pause(2000);
      return true;
      
    } catch (error) {
      console.error("Failed to go back:", error);
      return false;
    }
  }
  // Add this debug method to address.page.ts

// Update the debugAddressPage method to fix the async length issue

private async debugAddressPage() {
  try {
    console.log("\n--- Debugging Address Page ---");
    
    // Check all buttons
    const buttons = await browser.$$('//android.widget.Button');
    const buttonCount = await buttons.length; // Fix: await the length
    console.log(`Found ${buttonCount} buttons on page`);
    
    // Log button details using UI Automator
    for (let i = 0; i < Math.min(buttonCount, 5); i++) {
      try {
        const btn = await browser.$(`android=new UiSelector().className("android.widget.Button").instance(${i})`);
        if (await btn.isExisting()) {
          const text = await btn.getText() || await btn.getAttribute('content-desc') || 'No text';
          console.log(`Button[${i}]: ${text}`);
        }
      } catch (e) {
        // Continue
      }
    }
    
    // Check for address cards
    const addressCards = await browser.$$('//android.view.View[contains(@content-desc, "Google Building") or contains(@content-desc, "HOME") or contains(@content-desc, "WORK")]');
    const cardCount = await addressCards.length; // Fix: await the length
    console.log(`Found ${cardCount} address cards`);
    
    await this.takeScreenshot('debug-address-page');
    console.log("--- End Debug ---\n");
  } catch (error) {
    console.log("Debug failed:", error);
  }
}
async clickAddAddress(): Promise<boolean> {
  console.log("\nClicking Add Address button...");
  
  try {
    // Check if we already have addresses
    const addressCards = await browser.$$('//android.view.View[contains(@content-desc, "HOME") or contains(@content-desc, "WORK") or contains(@content-desc, "OTHER")]');
    const addressCount = await addressCards.length;
    const hasAddresses = addressCount > 0;
    
    let addBtn;
    
    if (hasAddresses) {
      console.log(`Addresses exist (${addressCount} found), looking for floating action button...`);
      
      // Get all buttons and find the last one (which should be the + button)
      const allButtons = await browser.$$('//android.widget.Button');
      const buttonCount = await allButtons.length;
      console.log(`Total buttons on page: ${buttonCount}`);
      
      // The floating + button is typically the last button
      if (buttonCount > 0) {
        // Try to click the last button
        const lastButtonSelector = `(//android.widget.Button)[${buttonCount}]`;
        addBtn = await browser.$(lastButtonSelector);
        
        if (await addBtn.isExisting()) {
          // Verify it's not a delete button by checking its position or size
          const location = await addBtn.getLocation();
          const size = await addBtn.getSize();
          const windowSize = await browser.getWindowSize();
          
          console.log(`Last button location: x=${location.x}, y=${location.y}`);
          console.log(`Last button size: width=${size.width}, height=${size.height}`);
          console.log(`Window size: width=${windowSize.width}, height=${windowSize.height}`);
          
          // The + button is typically in the bottom right corner
          const isBottomRight = location.x > (windowSize.width * 0.7) && 
                               location.y > (windowSize.height * 0.7);
          
          if (isBottomRight) {
            console.log("Found floating + button at bottom right");
          } else {
            console.log("Last button is not in bottom right, searching for alternative...");
            
            // Try alternative selectors
            const alternativeSelectors = [
              '//android.widget.Button[contains(@bounds, "[975,2115]")]', // Adjust bounds based on your screen
              '//android.widget.Button[@clickable="true" and @focusable="true" and @enabled="true"][last()]',
              '//android.widget.FrameLayout/android.widget.Button[last()]'
            ];
            
            for (const selector of alternativeSelectors) {
              try {
                const altBtn = await browser.$(selector);
                if (await altBtn.isExisting()) {
                  addBtn = altBtn;
                  console.log(`Found button with selector: ${selector}`);
                  break;
                }
              } catch (e) {
                // Continue
              }
            }
          }
        }
      }
    } else {
      // When no addresses exist, use the original selectors
      console.log("No addresses yet, looking for Add New Address button...");
      
      const initialButtonSelectors = [
        '//android.widget.Button[@content-desc="Add New Address"]',
        '//android.widget.Button[contains(@text, "Add New Address")]',
        this.addAddressButton,
        this.addAddressButtonAlt
      ];
      
      for (const selector of initialButtonSelectors) {
        try {
          addBtn = await browser.$(selector);
          if (await addBtn.isExisting()) {
            console.log(`Found add button with selector: ${selector}`);
            break;
          }
        } catch (e) {
          // Continue to next selector
        }
      }
    }
    
    if (addBtn && await addBtn.isExisting()) {
      // Take a screenshot before clicking
      await this.takeScreenshot('before-clicking-add-button');
      
      await addBtn.click();
      console.log("✓ Add Address button clicked");
      await browser.pause(3000);
      
      // Verify we're on the location search page
      const searchInput = await browser.$(this.searchLocationInput);
      if (await searchInput.isExisting()) {
        console.log("✓ Successfully navigated to location search page");
        return true;
      } else {
        console.log("⚠️ Not on location search page after click");
        return false;
      }
    }
    
    console.log("Add Address button not found");
    await this.takeScreenshot('add-button-not-found');
    
    // Debug: Log all clickable elements
    await this.debugClickableElements();
    
    return false;
    
  } catch (error) {
    console.error("Failed to click Add Address:", error);
    return false;
  }
}

// Add this helper method to debug clickable elements
private async debugClickableElements() {
  try {
    console.log("\n--- Debug: Clickable Elements ---");
    
    // Find all clickable buttons
    const clickableButtons = await browser.$$('//android.widget.Button[@clickable="true"]');
    const count = await clickableButtons.length;
    console.log(`Found ${count} clickable buttons`);
    
    for (let i = 0; i < count; i++) {
      try {
        const btn = clickableButtons[i];
        const text = await btn.getText() || await btn.getAttribute('content-desc') || 'No text';
        const location = await btn.getLocation();
        const size = await btn.getSize();
        console.log(`Button[${i}]: "${text}" at (${location.x}, ${location.y}) size: ${size.width}x${size.height}`);
      } catch (e) {
        // Continue
      }
    }
    
    console.log("--- End Debug ---\n");
  } catch (error) {
    console.log("Debug failed:", error);
  }
}
// Alternative method to click the floating action button by coordinates
async clickFloatingActionButton(): Promise<boolean> {
  console.log("\nClicking floating action button by coordinates...");
  
  try {
    const windowSize = await browser.getWindowSize();
    
    // The + button is typically at bottom right
    // Adjust these percentages based on your app's layout
    const x = Math.floor(windowSize.width * 0.9);  // 90% from left
    const y = Math.floor(windowSize.height * 0.85); // 85% from top
    
    console.log(`Clicking at coordinates: (${x}, ${y})`);
    
    // Perform tap at coordinates
    await browser.action('pointer')
      .move({ x, y })
      .down({ button: 0 })
      .pause(100)
      .up({ button: 0 })
      .perform();
    
    console.log("✓ Tapped at floating button location");
    await browser.pause(3000);
    
    // Verify we're on the location search page
    const searchInput = await browser.$(this.searchLocationInput);
    return await searchInput.isExisting();
    
  } catch (error) {
    console.error("Failed to click by coordinates:", error);
    return false;
  }
}
}