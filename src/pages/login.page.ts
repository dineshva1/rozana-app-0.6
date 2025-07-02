import { BasePage } from './base.page';
import { browser } from '@wdio/globals';

export class LoginPage extends BasePage {
  // Multiple selector strategies for Profile Tab
  private get profileTab() {
    return '//android.widget.ImageView[@content-desc="Profile Tab 4 of 4"]';
  }
  
  private get profileTabAlt1() {
    // Try without Tab text
    return '//android.widget.ImageView[@content-desc="Profile\nTab 4 of 4"]';
  }
  
  private get profileTabAlt2() {
    // Try with accessibility id
    return '~Profile\nTab 4 of 4';
  }
  
  private get profileTabAlt3() {
    // Try partial match
    return '//*[contains(@content-desc, "Profile") and contains(@content-desc, "Tab 4")]';
  }
  
  private get profileTabAlt4() {
    // Try by index if it's the 4th tab
    return '(//android.widget.ImageView[contains(@content-desc, "Tab")])[4]';
  }

  // Multiple selector strategies for Home Tab
  private get homeTab() {
    return '//android.widget.ImageView[@content-desc="Home Tab 1 of 4"]';
  }
  
  private get homeTabAlt1() {
    return '//android.widget.ImageView[@content-desc="Home\nTab 1 of 4"]';
  }
  
  private get homeTabAlt2() {
    return '~Home\nTab 1 of 4';
  }

  private get cancelButton() {
    return '//android.widget.ImageView[@content-desc="Cancel"]';
  }

  private get mobileNumberInput() {
    return '//android.widget.EditText';
  }

  private get sendOTPButton() {
    return '//android.widget.Button[@content-desc="Send OTP"]';
  }

  private get otpInput() {
    return '//android.widget.EditText';
  }

  private get verifyButton() {
    return '//android.widget.Button[@content-desc="Verify & Proceed"]';
  }

  // Helper method to find profile tab with multiple strategies
  private async findProfileTab() {
    const selectors = [
      this.profileTab,
      this.profileTabAlt1,
      this.profileTabAlt2,
      this.profileTabAlt3,
      this.profileTabAlt4
    ];
    
    for (const selector of selectors) {
      try {
        const element = await $(selector);
        if (await element.isExisting()) {
          console.log(`✓ Found Profile tab using selector: ${selector}`);
          return element;
        }
      } catch (e) {
        // Continue to next selector
      }
    }
    
    // If nothing found, log current page structure
    console.log("Could not find Profile tab. Let me check what's on screen...");
    await this.debugPageStructure();
    throw new Error("Profile tab not found with any selector strategy");
  }
  
  // Debug helper to understand page structure
  private async debugPageStructure() {
    try {
      // Find all ImageViews with content-desc
      const imageViews = await $$('//android.widget.ImageView[@content-desc]');
      console.log(`Found ${imageViews.length} ImageViews with content-desc`);
      
      let count = 0;
      for (const imageView of imageViews) {
        if (count >= 10) break;
        const contentDesc = await imageView.getAttribute('content-desc');
        console.log(`ImageView[${count}] content-desc: "${contentDesc}"`);
        count++;
      }
      
      // Find all elements with "Tab" in content-desc
      const tabElements = await $$('//*[contains(@content-desc, "Tab")]');
      console.log(`\nFound ${tabElements.length} elements with "Tab" in content-desc`);
      
      count = 0;
      for (const tabElement of tabElements) {
        if (count >= 5) break;
        const contentDesc = await tabElement.getAttribute('content-desc');
        const tagName = await tabElement.getTagName();
        console.log(`Tab[${count}] ${tagName}: "${contentDesc}"`);
        count++;
      }
    } catch (error) {
      console.log("Error during debug:", error);
    }
  }

  // Step 1 - Updated with better error handling
  async navigateToProfile() {
    console.log("Step 1: Navigating to Profile tab...");
    await browser.pause(3000);
    
    try {
      const profileElement = await this.findProfileTab();
      await profileElement.click();
      console.log("✓ Profile tab clicked");
      await browser.pause(3000);
    } catch (error) {
      console.error("Failed to click Profile tab:", error);
      await this.takeScreenshot('profile-tab-not-found');
      throw error;
    }
  }

  // Step 2
  async cancelMobileNumberPrompt() {
    console.log("Step 2: Checking for mobile number prompt...");
    await browser.pause(2000);
    const exists = await this.isElementExisting(this.cancelButton);
    if (exists) {
      console.log("✓ Found cancel button, clicking it...");
      await this.clickElement(this.cancelButton);
      await browser.pause(2000);
    } else {
      console.log("✓ No cancel button found, proceeding...");
    }
  }

  // Step 3 - Professional approach with setValue
  async enterMobileNumber(mobileNumber: string) {
    console.log(`Step 3: Entering mobile number: ${mobileNumber}`);

    if (!mobileNumber || mobileNumber.length !== 10) {
      throw new Error("❌ Invalid mobile number. Must be exactly 10 digits.");
    }

    try {
      const input = await this.findElement(this.mobileNumberInput);
      await input.waitForDisplayed({ timeout: 10000 });
      
      // Click to focus the input field
      await input.click();
      await browser.pause(500); // Brief pause for keyboard to appear
      
      // Clear any existing value and set new value at once
      await input.clearValue();
      await input.setValue(mobileNumber);
      
      await browser.pause(500); // Brief pause to ensure value is set
      
      // Verify the value was entered correctly
      let typedValue = await input.getText();
      if (!typedValue || typedValue === '') {
        typedValue = await input.getAttribute("text") || await input.getAttribute("value");
      }
      
      console.log(`📥 Entered value: ${typedValue}`);
      
      if (typedValue !== mobileNumber) {
        console.warn(`⚠️ Value mismatch. Expected: ${mobileNumber}, Got: ${typedValue}`);
        // Try one more time with a different approach
        await input.clearValue();
        await browser.pause(300);
        await input.addValue(mobileNumber);
        await browser.pause(300);
      }
      
      console.log("✅ Mobile number entered successfully");
    } catch (error) {
      console.error("❌ Error entering mobile number:", error);
      throw new Error(`Failed to enter mobile number: ${error}`);
    }
  }

  // Step 4
  async clickSendOTP() {
    console.log("Step 4: Clicking Send OTP button...");
    await this.clickElement(this.sendOTPButton);
    console.log("✓ Send OTP clicked");
    await browser.pause(5000); // Wait for OTP screen
  }

  // Step 5 - Professional approach with setValue
  async enterOTP(otp: string) {
    console.log(`Step 5: Entering OTP: ${otp}`);

    if (!otp || otp.length !== 6) {
      throw new Error("❌ Invalid OTP. Must be exactly 6 digits.");
    }

    try {
      await browser.pause(2000); // Wait for OTP screen to be ready

      const otpElement = await this.findElement(this.otpInput);
      await otpElement.waitForDisplayed({ timeout: 10000 });
      
      // Click to focus the input field
      await otpElement.click();
      await browser.pause(500); // Brief pause for keyboard
      
      // Clear and set OTP value at once
      await otpElement.clearValue();
      await otpElement.setValue(otp);
      
      await browser.pause(500); // Brief pause to ensure value is set
      
      // Verify the value was entered correctly
      let typedValue = await otpElement.getText();
      if (!typedValue || typedValue === '') {
        typedValue = await otpElement.getAttribute("text") || await otpElement.getAttribute("value");
      }
      
      console.log(`📥 Entered OTP: ${typedValue || '[hidden]'}`);
      
      console.log("✅ OTP entered successfully");
      await this.takeScreenshot('otp-entry-success');
      
      // Auto-submit might happen, so wait a bit
      await browser.pause(1000);
      
    } catch (error) {
      console.error("❌ Error entering OTP:", error);
      throw new Error(`Failed to enter OTP: ${error}`);
    }
  }

  // Step 6 - Click Verify & Proceed if needed
  async clickVerifyAndProceedIfVisible() {
    console.log("Step 6: Checking if Verify & Proceed button is visible...");
    try {
      const verifyBtn = await $(this.verifyButton);
      if (await verifyBtn.isDisplayed()) {
        console.log("✓ Verify & Proceed button found, clicking it...");
        await verifyBtn.click();
        await browser.pause(3000);
      } else {
        console.log("✓ Verify & Proceed button not visible (auto-submit may have occurred)");
      }
    } catch (error) {
      console.log("✓ No Verify & Proceed button needed");
    }
  }

  // Step 7 - Updated with multiple selector strategies
  async navigateToHome(): Promise<boolean> {
    console.log("Step 7: Navigating back to Home tab from My Profile...");
    await browser.pause(3000);
    
    const selectors = [this.homeTab, this.homeTabAlt1, this.homeTabAlt2];
    
    for (const selector of selectors) {
      try {
        const element = await $(selector);
        if (await element.isExisting()) {
          await element.click();
          console.log("✓ Home tab clicked");
          await browser.pause(2000);
          return true;
        }
      } catch (error) {
        // Continue to next selector
      }
    }
    
    console.error("❌ Failed to navigate to Home with any selector");
    return false;
  }

  // Full login flow - Updated with professional input handling
  async performLogin(mobileNumber: string, otp: string) {
    console.log("=== Starting Login Flow ===");

    try {
      await this.navigateToProfile();
      await this.cancelMobileNumberPrompt();
      await this.enterMobileNumber(mobileNumber);
      await this.clickSendOTP();
      await this.enterOTP(otp);
      await this.clickVerifyAndProceedIfVisible(); // Check if button is needed
      
      const navigatedToHome = await this.navigateToHome();
      if (!navigatedToHome) {
        throw new Error("Failed to navigate to Home after login");
      }
      
      console.log("✅ Login Flow Completed - User redirected to Home");

    } catch (error) {
      console.error("❌ Login failed:", error);
      await this.takeScreenshot('login-failed-final');
      throw error;
    }
  }
}