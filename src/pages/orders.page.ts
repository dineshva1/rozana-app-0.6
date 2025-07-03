// src/pages/orders.page.ts
import { BasePage } from './base.page';
import { browser } from '@wdio/globals';
import { SwipeUtils } from '../utils/swipe.utils';

export class OrdersPage extends BasePage {
  // Order tabs
  private get allTab() {
    return '//android.widget.Button[@content-desc="All"]';
  }

  private get pendingTab() {
    return '//android.widget.Button[@content-desc="Pending"]';
  }

  private get activeTab() {
    return '//android.widget.Button[@content-desc="Active"]';
  }

  private get deliveredTab() {
    return '//android.widget.Button[@content-desc="Delivered"]';
  }

  private get cancelledTab() {
    return '//android.widget.Button[@content-desc="Cancelled"]';
  }

  private get backButton() {
    return '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View[1]/android.widget.Button[1]';
  }

  private get backButtonAlt() {
    return '(//android.widget.Button)[1]';
  }

  private get orderItems() {
    return '//android.view.View[contains(@content-desc, "Order #")]';
  }

  // Click on a specific tab
  async clickTab(tabName: 'All' | 'Pending' | 'Active' | 'Delivered' | 'Cancelled') {
    console.log(`Clicking on ${tabName} tab...`);
    
    let selector;
    switch(tabName) {
      case 'All':
        selector = this.allTab;
        break;
      case 'Pending':
        selector = this.pendingTab;
        break;
      case 'Active':
        selector = this.activeTab;
        break;
      case 'Delivered':
        selector = this.deliveredTab;
        break;
      case 'Cancelled':
        selector = this.cancelledTab;
        break;
    }
    
    try {
      const element = await $(selector);
      await element.click();
      console.log(`✓ ${tabName} tab clicked`);
      await browser.pause(2000);
    } catch (error) {
      console.error(`Failed to click ${tabName} tab:`, error);
      throw error;
    }
  }

  // Swipe to reveal Cancelled tab
  async swipeToRevealCancelledTab() {
    console.log("Swiping to reveal Cancelled tab...");
    
    try {
      // Get screen dimensions
      const { width, height } = await browser.getWindowSize();
      
      // Swipe left on the tab bar (assuming tabs are near top)
      await SwipeUtils.swipeLeftExact(
        width * 0.8,  // Start from right side
        height * 0.15, // Tab bar position
        width * 0.2,  // End at left side
        height * 0.15,
        800
      );
      
      console.log("✓ Swiped to reveal more tabs");
      await browser.pause(1000);
    } catch (error) {
      console.error("Failed to swipe for Cancelled tab:", error);
    }
  }

  // Scroll through orders in current tab
  // Scroll through orders in current tab
async scrollThroughOrders() {
  console.log("Scrolling through orders...");
  
  let previousOrderCount = 0;
  let currentOrderCount = 0;
  let noNewOrdersCount = 0;
  const maxScrolls = 10;
  let scrollCount = 0;
  
  while (scrollCount < maxScrolls && noNewOrdersCount < 2) {
    try {
      // Count current visible orders
      const orders = await $$(this.orderItems);
      currentOrderCount = Array.from(orders).length;  // Convert to regular array
      
      console.log(`Found ${currentOrderCount} orders`);
      
      // Check if we've reached the end (no new orders after scroll)
      if (currentOrderCount === previousOrderCount) {
        noNewOrdersCount++;
        if (noNewOrdersCount >= 2) {
          console.log("✓ Reached end of orders");
          break;
        }
      } else {
        noNewOrdersCount = 0;
      }
      
      previousOrderCount = currentOrderCount;
      
      // Swipe up to see more orders
      await SwipeUtils.swipeUp(0.6);
      await browser.pause(1000);
      
      scrollCount++;
    } catch (error) {
      console.log("Error while scrolling:", error);
      break;
    }
  }
  
  console.log(`✓ Scrolled through ${currentOrderCount} orders`);
}

  // Navigate through all tabs
  async navigateThroughAllTabs() {
    console.log("=== Navigating through all order tabs ===");
    
    // Click on each tab and scroll through orders
    const tabs: Array<'All' | 'Pending' | 'Active' | 'Delivered' | 'Cancelled'> = 
      ['All', 'Pending', 'Active', 'Delivered', 'Cancelled'];
    
    for (const tab of tabs) {
      try {
        // Swipe to reveal Cancelled tab if needed
        if (tab === 'Cancelled') {
          await this.swipeToRevealCancelledTab();
        }
        
        await this.clickTab(tab);
        await this.scrollThroughOrders();
        await this.takeScreenshot(`orders-${tab.toLowerCase()}`);
        
        // Scroll back to top for next tab
        await SwipeUtils.swipeDown(0.8);
        await browser.pause(500);
      } catch (error) {
        console.error(`Error in ${tab} tab:`, error);
        continue;
      }
    }
  }

  // Go back to previous screen - now returns boolean
  async goBack(): Promise<boolean> {
    console.log("Going back to Profile...");
    
    try {
      let element = await $(this.backButton);
      if (await element.isExisting()) {
        await element.click();
        console.log("✓ Back button clicked");
        await browser.pause(2000);
        return true;
      } else {
        element = await $(this.backButtonAlt);
        if (await element.isExisting()) {
          await element.click();
          console.log("✓ Back button clicked (alt)");
          await browser.pause(2000);
          return true;
        }
      }
      
      console.error("Back button not found");
      return false;
    } catch (error) {
      console.error("Failed to go back:", error);
      return false;
    }
  }
}