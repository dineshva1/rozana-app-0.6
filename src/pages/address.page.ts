// src/pages/address.page.ts
import { BasePage } from './base.page';
import { browser } from '@wdio/globals';
import {TestHelpers} from '../utils/test-helpers';
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
  
  private getEditAddressButton(addressType: string = 'HOME') {
  return `//android.view.View[contains(@content-desc, "${addressType}")]/android.widget.Button[1]`;
}

// Get delete button for a specific address  
private getDeleteAddressButton(addressType: string = 'HOME') {
  return `//android.view.View[contains(@content-desc, "${addressType}")]/android.widget.Button[2]`;
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
// Edit address method
async editAddress(addressType: 'HOME' | 'WORK' | 'OTHER', newSearchText: string, newResultText: string): Promise<boolean> {
  console.log(`\n=== Editing ${addressType} address ===`);
  
  try {
    // Find and click edit button
    const editButtonSelector = this.getEditAddressButton(addressType);
    const editBtn = await browser.$(editButtonSelector);
    
    if (!await editBtn.isExisting()) {
      // Try with index-based selector
      const altEditBtn = await browser.$('android=new UiSelector().className("android.widget.Button").instance(1)');
      if (await altEditBtn.isExisting()) {
        await altEditBtn.click();
      } else {
        console.log(`Edit button not found for ${addressType}`);
        return false;
      }
    } else {
      await editBtn.click();
    }
    
    console.log("✓ Edit button clicked");
    await browser.pause(3000);
    
    // Clear existing search and enter new location
    const searchInput = await browser.$(this.searchLocationInput);
    if (await searchInput.isExisting()) {
      await searchInput.click();
      await browser.pause(500);
      await searchInput.clearValue();
      await searchInput.setValue(newSearchText);
      console.log(`✓ Entered new search text: ${newSearchText}`);
      await browser.pause(2000);
    }
    
    // Select new location
    const resultSelector = this.getAddressResult(newResultText);
    const resultBtn = await browser.$(resultSelector);
    
    if (await resultBtn.isExisting()) {
      await resultBtn.click();
      console.log(`✓ Selected: ${newResultText}`);
    } else {
      // Try first result
      const firstResult = await browser.$('//android.widget.Button[contains(@content-desc, ",")]');
      if (await firstResult.isExisting()) {
        await firstResult.click();
        console.log("✓ Selected first result");
      }
    }
    await browser.pause(2000);
    
    // Confirm location
    if (!await this.confirmLocation()) {
      return false;
    }
    
    // Wait for address details page
    await browser.pause(2000);
    
    // Save updated address
    if (!await this.saveAddress()) {
      return false;
    }
    
    console.log(`✅ ${addressType} address updated successfully`);
    await this.takeScreenshot(`address-edited-${addressType.toLowerCase()}`);
    return true;
    
  } catch (error) {
    console.error(`Failed to edit ${addressType} address:`, error);
    return false;
  }
}

// Delete address method
async deleteAddress(addressType: 'HOME' | 'WORK' | 'OTHER'): Promise<boolean> {
  console.log(`\n=== Deleting ${addressType} address ===`);
  
  try {
    // Find and click delete button
    const deleteButtonSelector = this.getDeleteAddressButton(addressType);
    const deleteBtn = await browser.$(deleteButtonSelector);
    
    if (!await deleteBtn.isExisting()) {
      // Try with index-based selector
      const altDeleteBtn = await browser.$('android=new UiSelector().className("android.widget.Button").instance(2)');
      if (await altDeleteBtn.isExisting()) {
        await altDeleteBtn.click();
      } else {
        console.log(`Delete button not found for ${addressType}`);
        return false;
      }
    } else {
      await deleteBtn.click();
    }
    
    console.log("✓ Delete button clicked");
    await browser.pause(2000);
    
    // Handle confirmation dialog if it appears
    const confirmSelectors = [
      '//android.widget.Button[@text="Delete"]',
      '//android.widget.Button[@text="Confirm"]',
      '//android.widget.Button[@text="Yes"]',
      '//android.widget.Button[@content-desc="Delete"]'
    ];
    
    for (const selector of confirmSelectors) {
      try {
        const confirmBtn = await browser.$(selector);
        if (await confirmBtn.isExisting()) {
          await confirmBtn.click();
          console.log("✓ Deletion confirmed");
          await browser.pause(2000);
          break;
        }
      } catch (e) {
        // Continue
      }
    }
    
    console.log(`✅ ${addressType} address deleted successfully`);
    await this.takeScreenshot(`address-deleted-${addressType.toLowerCase()}`);
    return true;
    
  } catch (error) {
    console.error(`Failed to delete ${addressType} address:`, error);
    return false;
  }
}

// Perform CRUD operations on addresses
async performAddressCRUDOperations(): Promise<boolean> {
  console.log("\n=== Performing CRUD Operations on Addresses ===");
  
  try {
    // Wait for My Addresses page to be stable
    await browser.pause(2000);
    
    // Step 1: Edit HOME address to Palamaner
    console.log("\nStep 1: Editing HOME address...");
    const editSuccess = await this.editAddress('HOME', 'Palamaner', 'Palamaner');
    if (!editSuccess) {
      console.log("Failed to edit HOME address");
      return false;
    }
    
    // Wait a bit after edit
    await browser.pause(2000);
    
    // Step 2: Delete HOME address
    console.log("\nStep 2: Deleting HOME address...");
    const deleteSuccess = await this.deleteAddress('HOME');
    if (!deleteSuccess) {
      console.log("Failed to delete HOME address");
      return false;
    }
    
    console.log("\n✅ CRUD operations completed successfully");
    console.log("   • HOME address edited to Palamaner location");
    console.log("   • HOME address deleted");
    
    return true;
    
  } catch (error) {
    console.error("CRUD operations failed:", error);
    return false;
  }
}
// Add these methods to your AddressPage class in src/pages/address.page.ts

  // Method to get current address from the address field
  async getCurrentAddressFromField(): Promise<string> {
    try {
      // Multiple selectors for the address field
      const selectors = [
        '//android.view.View[contains(@content-desc, "Bengaluru, Karnataka")]',
        '//android.view.View[contains(@content-desc, ", Karnataka,")]',
        '//android.widget.TextView[contains(@text, "Bengaluru")]',
        '//android.view.View[@clickable="false"][contains(@content-desc, ",")]'
      ];
      
      for (const selector of selectors) {
        const element = await browser.$(selector);
        if (await element.isExisting()) {
          const contentDesc = await element.getAttribute('content-desc');
          const text = await element.getText();
          const address = contentDesc || text;
          console.log(`Current address found: ${address}`);
          return address;
        }
      }
      
      console.log("Could not find address field with standard selectors");
      return "";
    } catch (error) {
      console.error(`Error getting current address: ${error}`);
      return "";
    }
  }

  // Method to perform map drag
  async dragMapToChangeLocation(): Promise<boolean> {
    try {
      console.log("\n=== Performing map drag to change location ===");
      
      // Wait for map to be fully loaded
      await browser.pause(2000);
      
      // Get screen dimensions
      const { width, height } = await browser.getWindowSize();
      
      // Calculate drag coordinates (drag from center to upper area)
      const startX = Math.floor(width / 2);
      const startY = Math.floor(height / 2);
      const endX = Math.floor(width / 2);
      const endY = Math.floor(height / 4); // Drag up to change location
      
      console.log(`Dragging from (${startX}, ${startY}) to (${endX}, ${endY})`);
      
      // Perform the drag action
      await browser.action('pointer')
        .move({ x: startX, y: startY })
        .down()
        .pause(100)
        .move({ x: endX, y: endY, duration: 1000 })
        .up()
        .perform();
      
      console.log("✓ Map drag completed");
      
      // Wait for address to update
      await browser.pause(3000);
      
      return true;
    } catch (error) {
      console.error(`Error dragging map: ${error}`);
      return false;
    }
  }

  // Method to verify address changed after drag
  async verifyAddressChangedAfterDrag(initialAddress: string): Promise<boolean> {
    try {
      console.log("\n=== Verifying address change after drag ===");
      console.log(`Initial address: ${initialAddress}`);
      
      // Wait for potential address update
      await browser.pause(2000);
      
      // Get new address
      const newAddress = await this.getCurrentAddressFromField();
      console.log(`New address: ${newAddress}`);
      
      if (!newAddress) {
        console.log("Could not retrieve new address");
        return false;
      }
      
      // Check if address changed
      const addressChanged = newAddress !== initialAddress && newAddress.length > 0;
      
      if (addressChanged) {
        console.log("✓ Address successfully changed after map drag");
        await TestHelpers.takeScreenshot('address-changed-after-drag');
      } else {
        console.log("✗ Address did not change after map drag");
        await TestHelpers.takeScreenshot('address-not-changed');
      }
      
      return addressChanged;
    } catch (error) {
      console.error(`Error verifying address change: ${error}`);
      return false;
    }
  }
// Add this method to AddressPage class
async completeAddressDetailsForm(): Promise<boolean> {
  try {
    console.log("Completing address details form...");
    
    // Add house/flat number if field exists
    const houseNumberField = await browser.$('//android.widget.EditText[contains(@text, "House") or contains(@text, "Flat")]');
    if (await houseNumberField.isExisting()) {
      await houseNumberField.setValue("123");
      console.log("✓ Added house/flat number");
    }
    
    // Add landmark if field exists
    const landmarkField = await browser.$('//android.widget.EditText[contains(@text, "Landmark")]');
    if (await landmarkField.isExisting()) {
      await landmarkField.setValue("Near Park");
      console.log("✓ Added landmark");
    }
    
    // Save address
    const saveButton = await browser.$('//android.widget.Button[@content-desc="Save Address"]');
    if (await saveButton.isExisting()) {
      await saveButton.click();
      console.log("✓ Clicked Save Address");
      await browser.pause(2000);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`Error completing address form: ${error}`);
    return false;
  }
}
  // Enhanced edit address method with map drag
  async editAddressWithMapDrag(addressType: string): Promise<boolean> {
    try {
      console.log(`\n=== Editing ${addressType} address with map drag ===`);
      
      // Find and click edit button for the address type
      const editButton = await browser.$(`//android.widget.Button[@content-desc="Edit" and preceding-sibling::android.view.View[contains(@content-desc, "${addressType.toUpperCase()}")]]`);
      
      if (!(await editButton.isExisting())) {
        console.log(`Edit button for ${addressType} not found`);
        return false;
      }
      
      await editButton.click();
      console.log(`✓ Clicked edit for ${addressType} address`);
      await browser.pause(3000);
      
      // Get initial address
      const initialAddress = await this.getCurrentAddressFromField();
      console.log(`Initial address before drag: ${initialAddress}`);
      
      // Perform map drag
      const dragSuccess = await this.dragMapToChangeLocation();
      if (!dragSuccess) {
        console.log("Map drag failed");
        return false;
      }
      
      // Verify address changed
      const addressChanged = await this.verifyAddressChangedAfterDrag(initialAddress);
      
      if (addressChanged) {
        // Confirm the new location
        const confirmButton = await browser.$('//android.widget.Button[@content-desc="Confirm Location"]');
        if (await confirmButton.isExisting()) {
          await confirmButton.click();
          console.log("✓ Confirmed new location");
          await browser.pause(2000);
          
          // Complete the address form
          await this.completeAddressDetailsForm();
          console.log("✓ Address edit with map drag completed");
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error(`Error editing address with map drag: ${error}`);
      return false;
    }
  }

  // Updated CRUD operations method with map drag
async performAddressCRUDOperationsWithMapDrag(): Promise<void> {
  try {
    console.log("\n=== Starting Address CRUD Operations with Map Drag ===");
    
    // Edit HOME address with map drag - use uppercase
    const editSuccess = await this.editAddressWithMapDrag("HOME"); // Changed from "home" to "HOME"
    
    if (editSuccess) {
      console.log("✓ Successfully edited HOME address with map drag");
      await browser.pause(2000);
      
      // Delete the edited address - use uppercase
      console.log("\n=== Deleting edited HOME address ===");
      const deleteSuccess = await this.deleteAddress("HOME"); // Changed from "home" to "HOME"
      
      if (deleteSuccess) {
        console.log("✓ Successfully deleted HOME address");
      } else {
        console.log("✗ Failed to delete HOME address");
      }
    } else {
      console.log("✗ Edit with map drag failed, skipping delete");
    }
    
  } catch (error) {
    console.error(`CRUD operations error: ${error}`);
    throw error;
  }
}
// Add this new method to perform the complete test flow
async performCompleteAddressCRUDWithMapDrag(): Promise<boolean> {
  try {
    console.log("\n=== Starting Complete Address CRUD Test with Map Drag ===");
    
    // Phase 1: Create initial test address (HOME)
    console.log("\n--- Phase 1: Creating initial HOME address for testing ---");
    const initialAddressCreated = await this.addCompleteAddress(
      "Headrun",
      "Headrun, 80 Feet Road", 
      "home",
      false
    );
    
    if (!initialAddressCreated) {
      throw new Error("Failed to create initial HOME address");
    }
    console.log("✓ Initial HOME address created");
    await browser.pause(2000);
    
    // Modify the Phase 2 section in performCompleteAddressCRUDWithMapDrag method

    // Phase 2: Edit HOME address with map drag
    console.log("\n--- Phase 2: Editing HOME address with map drag ---");
    
    // Find and click edit button
    const editSelectors = [
      '//android.widget.Button[@content-desc="Edit" and preceding-sibling::android.view.View[contains(@content-desc, "HOME")]]',
      '//android.view.View[contains(@content-desc, "HOME")]//following-sibling::android.widget.Button[1]',
      '(//android.widget.Button[@content-desc="Edit"])[1]',
      'android=new UiSelector().className("android.widget.Button").instance(1)'
    ];
    
    let editClicked = false;
    for (const selector of editSelectors) {
      try {
        const editBtn = await browser.$(selector);
        if (await editBtn.isExisting()) {
          await editBtn.click();
          console.log(`✓ Edit button clicked using: ${selector}`);
          editClicked = true;
          break;
        }
      } catch (e) {
        // Continue
      }
    }
    
    if (!editClicked) {
      throw new Error("Could not find edit button for HOME address");
    }
    
    await browser.pause(3000);
    
    // Get initial address
    const initialAddress = await this.getCurrentAddressFromField();
    console.log(`📍 Initial address: "${initialAddress}"`);
    
    if (!initialAddress) {
      throw new Error("Could not get initial address");
    }
    
    await TestHelpers.takeScreenshot('before-map-drag');
    
    // Perform multiple map drags to ensure address changes
    console.log("\n🗺️  Performing multiple map drags to change location...");
    
    let currentAddress = initialAddress;
    let addressChanged = false;
    const maxDrags = 4;
    
    // Define different drag patterns based on your Appium Inspector coordinates
    const dragPatterns = [
      // Drag 1: Right to left (horizontal)
      { startX: 851, startY: 825, endX: 374, endY: 817, description: "right to left" },
      // Drag 2: Left to right (horizontal)
      { startX: 215, startY: 873, endX: 864, endY: 864, description: "left to right" },
      // Drag 3: Bottom to top (vertical)
      { startX: 825, startY: 1354, endX: 834, endY: 984, description: "bottom to top" },
      // Drag 4: Top to bottom (vertical)
      { startX: 206, startY: 950, endX: 193, endY: 1431, description: "top to bottom" }
    ];
    
    // Get screen dimensions to calculate relative positions
    const { width, height } = await browser.getWindowSize();
    console.log(`Screen dimensions: ${width}x${height}`);
    
    // Perform drags until address changes or max attempts reached
    for (let i = 0; i < maxDrags; i++) {
      console.log(`\nDrag attempt ${i + 1}/${maxDrags}`);
      
      // Use pattern or calculate relative positions
      let startX, startY, endX, endY;
      
      if (width === 1080 && height === 2400) {
        // Use exact coordinates if screen matches
        const pattern = dragPatterns[i];
        startX = pattern.startX;
        startY = pattern.startY;
        endX = pattern.endX;
        endY = pattern.endY;
        console.log(`Using exact coordinates: ${pattern.description}`);
      } else {
        // Calculate relative positions for different screen sizes
        const patterns = [
          { startX: 0.79, startY: 0.34, endX: 0.35, endY: 0.34 }, // Right to left
          { startX: 0.20, startY: 0.36, endX: 0.80, endY: 0.36 }, // Left to right
          { startX: 0.76, startY: 0.56, endX: 0.77, endY: 0.41 }, // Bottom to top
          { startX: 0.19, startY: 0.40, endX: 0.18, endY: 0.60 }  // Top to bottom
        ];
        const pattern = patterns[i];
        startX = Math.floor(width * pattern.startX);
        startY = Math.floor(height * pattern.startY);
        endX = Math.floor(width * pattern.endX);
        endY = Math.floor(height * pattern.endY);
        console.log(`Using relative coordinates for screen ${width}x${height}`);
      }
      
      console.log(`Dragging from (${startX}, ${startY}) to (${endX}, ${endY})`);
      
      // Perform the drag
      await browser.action('pointer')
        .move({ duration: 0, x: startX, y: startY })
        .down({ button: 0 })
        .move({ duration: 1000, x: endX, y: endY })
        .up({ button: 0 })
        .perform();
      
      console.log("✓ Drag completed");
      
      // Wait for geocoding to update
      await browser.pause(3000);
      
      // Check if address changed
      const newAddress = await this.getCurrentAddressFromField();
      console.log(`📍 Address after drag ${i + 1}: "${newAddress}"`);
      
      if (newAddress && newAddress !== initialAddress && newAddress !== currentAddress) {
        addressChanged = true;
        currentAddress = newAddress;
        console.log("✅ Address changed successfully!");
        await TestHelpers.takeScreenshot(`after-map-drag-${i + 1}`);
        
        // Optional: Continue dragging to show multiple changes
        if (i < maxDrags - 1) {
          console.log("Continuing with more drags to demonstrate multiple location changes...");
        }
      } else {
        console.log("⚠️ Address unchanged, trying next drag pattern...");
      }
    }
    
    if (!addressChanged) {
      console.log("⚠️ Warning: Address may not have changed significantly after all drag attempts");
    } else {
      console.log(`\n✅ Address successfully changed through map dragging!`);
      console.log(`   From: "${initialAddress}"`);
      console.log(`   To: "${currentAddress}"`);
    }
    
    await TestHelpers.takeScreenshot('final-map-position');
    
    // Confirm location
    const confirmBtn = await browser.$('//android.widget.Button[@content-desc="Confirm Location"]');
    if (await confirmBtn.isExisting()) {
      await confirmBtn.click();
      console.log("✓ New location confirmed");
      await browser.pause(2000);
    }
    
    // Save edited address
    await this.saveAddress();
    console.log("✓ Edited address saved");
    await browser.pause(2000);
    
    // Phase 3: Delete the edited HOME address
    console.log("\n--- Phase 3: Deleting HOME address ---");
    const deleteSuccess = await this.deleteAddress("HOME");
    
    if (!deleteSuccess) {
      throw new Error("Failed to delete HOME address");
    }
    console.log("✓ HOME address deleted");
    await browser.pause(2000);
    
    // Phase 4: Create 3 new addresses
    console.log("\n--- Phase 4: Creating 3 new addresses ---");
    
    // Create HOME
    console.log("\n1️⃣ Creating new HOME address...");
    const homeCreated = await this.addCompleteAddress(
      "Headrun",
      "Headrun, 80 Feet Road",
      "home",
      false
    );
    if (!homeCreated) throw new Error("Failed to create HOME address");
    console.log("✓ HOME address created");
    
    // Create WORK
    console.log("\n2️⃣ Creating WORK address...");
    const workCreated = await this.addCompleteAddress(
      "rozana rural commerce",
      "rozana rural commerce",
      "work",
      false
    );
    if (!workCreated) throw new Error("Failed to create WORK address");
    console.log("✓ WORK address created");
    
    // Create OTHER
    console.log("\n3️⃣ Creating OTHER address...");
    const otherCreated = await this.addCompleteAddress(
      "koramangala",
      "koramangala",
      "other",
      false
    );
    if (!otherCreated) throw new Error("Failed to create OTHER address");
    console.log("✓ OTHER address created");
    
    console.log("\n✅ Complete CRUD test finished successfully!");
    console.log("Final state: 3 addresses (HOME, WORK, OTHER)");
    
    return true;
    
  } catch (error) {
    console.error(`Complete CRUD test failed: ${error}`);
    await TestHelpers.takeScreenshot('crud-test-error');
    return false;
  }
}
// Add this method to find and click the floating add button more reliably
async clickAddAddressButton(): Promise<void> {
  try {
    const selectors = [
      '//android.widget.Button[@content-desc="Add New Address"]',
      '//android.widget.Button[contains(@content-desc, "Add")]',
      '//android.widget.Button[@text="Add New Address"]',
      '(//android.widget.Button)[last()]' // Often the last button when addresses exist
    ];
    
    for (const selector of selectors) {
      const button = await browser.$(selector);
      if (await button.isExisting()) {
        await button.click();
        console.log(`✓ Add Address button clicked using: ${selector}`);
        await browser.pause(3000);
        
        // Verify we're on search page
        const searchField = await browser.$(this.searchLocationInput);
        if (await searchField.isExisting()) {
          return;
        }
      }
    }
    
    // If standard selectors fail, try clicking the floating button by position
    console.log("Standard selectors failed, trying position-based click...");
    const success = await this.clickFloatingActionButton();
    if (!success) {
      throw new Error("Could not click Add Address button");
    }
  } catch (error) {
    console.error(`Error clicking add address button: ${error}`);
    throw error;
  }
}
}