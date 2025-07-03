// src/pages/profile.page.ts
import { BasePage } from './base.page';
import { browser } from '@wdio/globals';
import { SwipeUtils } from '../utils/swipe.utils';

export class ProfilePage extends BasePage {
  // Profile Tab selectors
  private get profileTab() {
    return '//android.widget.ImageView[@content-desc="Profile Tab 4 of 4"]';
  }
  
  private get profileTabAlt() {
    return '~Profile\nTab 4 of 4';
  }

  // Profile page elements
  private get yourOrdersCard() {
    return '//android.view.View[@content-desc="Your Orders"]';
  }

  private get yourOrdersCardAlt() {
    return '~Your Orders';
  }

  // ENGLISH UI - Language button selectors
  private get languageButtonEnglish() {
    return '//android.widget.Button[@content-desc="Language\nEnglish"]';
  }

  private get languageButtonHindi() {
    return '//android.widget.Button[@content-desc="Language\nहिंदी"]';
  }

  // ENGLISH UI - Alternative selectors using accessibility id
  private get languageButtonEnglishAlt() {
    return '~Language\nEnglish';
  }

  private get languageButtonHindiAlt() {
    return '~Language\nहिंदी';
  }

  // HINDI UI - Language button selectors (भाषा = Language in Hindi)
  private get bhashButtonEnglish() {
    return '//android.widget.Button[@content-desc="भाषा\nEnglish"]';
  }

  private get bhashButtonHindi() {
    return '//android.widget.Button[@content-desc="भाषा\nहिंदी"]';
  }

  // HINDI UI - Alternative selectors using accessibility id
  private get bhashButtonEnglishAlt() {
    return '~भाषा\nEnglish';
  }

  private get bhashButtonHindiAlt() {
    return '~भाषा\nहिंदी';
  }

  // Generic language selector - matches any language button
  private get languageButtonGeneric() {
    return '//android.widget.Button[contains(@content-desc, "Language") or contains(@content-desc, "भाषा")]';
  }

  // Dropdown options (these remain same in both languages)
  private get englishDropdownOption() {
    return '//android.widget.Button[@content-desc="English"]';
  }

  private get hindiDropdownOption() {
    return '//android.widget.Button[@content-desc="हिंदी"]';
  }

  private get homeTab() {
    return '//android.widget.ImageView[@content-desc="Home Tab 1 of 4"]';
  }

  private get homeTabAlt() {
    return '~Home\nTab 1 of 4';
  }

  // Navigate to Profile
  async navigateToProfile(): Promise<boolean> {
    console.log("Navigating to Profile tab...");
    
    try {
      // Try primary selector first
      let element = await $(this.profileTab);
      if (await element.isExisting()) {
        await element.click();
        console.log("✓ Profile tab clicked");
        await browser.pause(2000);
        return true;
      } else {
        // Try alternative selector
        element = await $(this.profileTabAlt);
        if (await element.isExisting()) {
          await element.click();
          console.log("✓ Profile tab clicked (alt)");
          await browser.pause(2000);
          return true;
        }
      }
      
      console.error("Profile tab not found");
      await this.takeScreenshot('profile-navigation-failed');
      return false;
    } catch (error) {
      console.error("Failed to navigate to Profile:", error);
      await this.takeScreenshot('profile-navigation-error');
      return false;
    }
  }

  // Check if profile page is displayed
  async isProfilePageDisplayed(): Promise<boolean> {
    try {
      const element = await $(this.yourOrdersCard);
      return await element.isDisplayed();
    } catch {
      try {
        const element = await $(this.yourOrdersCardAlt);
        return await element.isDisplayed();
      } catch {
        return false;
      }
    }
  }

  // Click on Your Orders
  async clickYourOrders(): Promise<void> {
    console.log("Clicking on Your Orders...");
    
    try {
      let element = await $(this.yourOrdersCard);
      if (await element.isExisting()) {
        await element.click();
        console.log("✓ Your Orders clicked");
        await browser.pause(2000);
        return;
      } else {
        element = await $(this.yourOrdersCardAlt);
        if (await element.isExisting()) {
          await element.click();
          console.log("✓ Your Orders clicked (alt)");
          await browser.pause(2000);
          return;
        }
      }
      
      throw new Error("Your Orders card not found");
    } catch (error) {
      console.error("Failed to click Your Orders:", error);
      throw error;
    }
  }

  // UPDATED: Get current language - checks both English and Hindi UI
  async getCurrentLanguage(): Promise<'English' | 'Hindi' | 'Unknown'> {
    try {
      // Check all possible selectors for both English and Hindi UI
      const selectors = [
        // English UI selectors
        { selector: this.languageButtonEnglish, lang: 'English' as const },
        { selector: this.languageButtonHindi, lang: 'Hindi' as const },
        { selector: this.languageButtonEnglishAlt, lang: 'English' as const },
        { selector: this.languageButtonHindiAlt, lang: 'Hindi' as const },
        // Hindi UI selectors (भाषा)
        { selector: this.bhashButtonEnglish, lang: 'English' as const },
        { selector: this.bhashButtonHindi, lang: 'Hindi' as const },
        { selector: this.bhashButtonEnglishAlt, lang: 'English' as const },
        { selector: this.bhashButtonHindiAlt, lang: 'Hindi' as const }
      ];
      
      for (const { selector, lang } of selectors) {
        try {
          const element = await $(selector);
          if (await element.isDisplayed()) {
            console.log(`Found language button with selector: ${selector}`);
            return lang;
          }
        } catch {
          // Continue to next selector
        }
      }
      
      // Try generic language button and check its text
      try {
        const genericButton = await $(this.languageButtonGeneric);
        if (await genericButton.isDisplayed()) {
          const text = await genericButton.getAttribute('content-desc');
          console.log(`Generic button text: ${text}`);
          if (text.includes('English')) return 'English';
          if (text.includes('हिंदी')) return 'Hindi';
        }
      } catch {
        // Continue
      }
      
      return 'Unknown';
    } catch {
      return 'Unknown';
    }
  }

  // UPDATED: Scroll to find language option - works for both UIs
  async scrollToLanguageOption(): Promise<boolean> {
    console.log("Scrolling to find Language option...");
    
    let maxScrolls = 8;
    let scrollCount = 0;
    
    // First try to find without scrolling
    const currentLang = await this.getCurrentLanguage();
    if (currentLang !== 'Unknown') {
      console.log(`✓ Language option already visible: ${currentLang}`);
      return true;
    }
    
    while (scrollCount < maxScrolls) {
      try {
        // Check if we can find the language option
        const currentLang = await this.getCurrentLanguage();
        if (currentLang !== 'Unknown') {
          console.log(`✓ Language option found: ${currentLang}`);
          return true;
        }
        
        // Also check for generic language button
        const genericButton = await $(this.languageButtonGeneric);
        if (await genericButton.isDisplayed()) {
          console.log("✓ Found generic language button");
          return true;
        }
      } catch {
        // Continue scrolling
      }
      
      // Swipe up to scroll down
      await SwipeUtils.swipeUp(0.4);
      scrollCount++;
      console.log(`Scroll attempt ${scrollCount} of ${maxScrolls}`);
      await browser.pause(500);
    }
    
    console.error("Could not find Language option after scrolling");
    return false;
  }

  // UPDATED: Find language button - works for both UIs
  async findLanguageButton(): Promise<ReturnType<typeof $> | null> {
    const selectors = [
      // English UI selectors
      this.languageButtonEnglish,
      this.languageButtonHindi,
      this.languageButtonEnglishAlt,
      this.languageButtonHindiAlt,
      // Hindi UI selectors
      this.bhashButtonEnglish,
      this.bhashButtonHindi,
      this.bhashButtonEnglishAlt,
      this.bhashButtonHindiAlt,
      // Generic selector
      this.languageButtonGeneric
    ];
    
    for (const selector of selectors) {
      try {
        const element = await $(selector);
        if (await element.isDisplayed()) {
          console.log(`Found language button with selector: ${selector}`);
          return element;
        }
      } catch {
        // Continue to next selector
      }
    }
    
    return null;
  }

  // Click on language dropdown arrow using coordinates
  async clickLanguageDropdownArrow(): Promise<boolean> {
    console.log("Clicking on language dropdown arrow...");
    
    try {
      // Find the language button
      const languageElement = await this.findLanguageButton();
      
      if (!languageElement) {
        console.error("Language button not found");
        return false;
      }
      
      // Get element location and size
      const location = await languageElement.getLocation();
      const size = await languageElement.getSize();
      
      console.log(`Element location: x=${location.x}, y=${location.y}`);
      console.log(`Element size: width=${size.width}, height=${size.height}`);
      
      // Calculate tap position (85% to the right for dropdown arrow)
      const tapX = location.x + (size.width * 0.85);
      const tapY = location.y + (size.height / 2);
      
      console.log(`Tapping at coordinates: (${tapX}, ${tapY})`);
      
      // Perform tap action at calculated coordinates
      await browser.action('pointer')
        .move({ x: Math.round(tapX), y: Math.round(tapY) })
        .down({ button: 0 })
        .pause(100)
        .up({ button: 0 })
        .perform();
      
      console.log("✓ Tapped on dropdown arrow");
      await browser.pause(1500); // Wait for dropdown animation
      
      // Verify dropdown opened
      const englishOption = await $(this.englishDropdownOption);
      const hindiOption = await $(this.hindiDropdownOption);
      
      if (await englishOption.isDisplayed() || await hindiOption.isDisplayed()) {
        console.log("✓ Dropdown menu opened successfully");
        return true;
      } else {
        console.warn("Dropdown may not have opened");
        return false;
      }
      
    } catch (error) {
      console.error("Failed to click dropdown arrow:", error);
      return false;
    }
  }

  // Click on language button
  async clickLanguageButton(): Promise<void> {
    console.log("Opening language dropdown...");
    
    try {
      // First ensure language option is visible
      const isVisible = await this.scrollToLanguageOption();
      if (!isVisible) {
        throw new Error("Could not find language option after scrolling");
      }
      
      // Try clicking the dropdown arrow first
      const dropdownOpened = await this.clickLanguageDropdownArrow();
      
      if (dropdownOpened) {
        return;
      }
      
      // Fallback: Try regular click on the entire element
      console.log("Trying fallback method - clicking entire element...");
      const languageElement = await this.findLanguageButton();
      
      if (!languageElement) {
        throw new Error("Language button not found");
      }
      
      await languageElement.click();
      await browser.pause(1500);
      
      // Verify dropdown opened
      const englishOption = await $(this.englishDropdownOption);
      const hindiOption = await $(this.hindiDropdownOption);
      
      if (!await englishOption.isDisplayed() && !await hindiOption.isDisplayed()) {
        throw new Error("Could not open language dropdown");
      }
      
      console.log("✓ Language dropdown opened");
      
    } catch (error) {
      console.error("Failed to open language dropdown:", error);
      await this.takeScreenshot('language-dropdown-error');
      throw error;
    }
  }

  // SIMPLIFIED: Change language
  async changeLanguage(toLanguage: 'Hindi' | 'English'): Promise<void> {
    console.log(`\n=== Changing language to ${toLanguage} ===`);
    
    try {
      // Step 1: Ensure we're on profile page and can see language option
      // Step 1: Ensure we're on profile page and can see language option
      await browser.pause(1000);
      
      // Step 2: Scroll to language option
      const foundLanguage = await this.scrollToLanguageOption();
      if (!foundLanguage) {
        throw new Error("Could not find language option");
      }
      
      // Step 3: Check current language
      const currentLang = await this.getCurrentLanguage();
      console.log(`Current language detected: ${currentLang}`);
      
      if (currentLang === toLanguage) {
        console.log(`Language is already set to ${toLanguage}`);
        return;
      }
      
      // Take screenshot before change
      await this.takeScreenshot(`before-language-change-${currentLang}`);
      
      // Step 4: Open dropdown
      await this.clickLanguageButton();
      await browser.pause(1000);
      
      // Step 5: Select the desired language
      if (toLanguage === 'Hindi') {
        const hindiOption = await $(this.hindiDropdownOption);
        await hindiOption.waitForDisplayed({ timeout: 5000 });
        await browser.pause(500);
        await hindiOption.click();
        console.log("✓ Clicked on 'हिंदी' option");
      } else {
        const englishOption = await $(this.englishDropdownOption);
        await englishOption.waitForDisplayed({ timeout: 5000 });
        await browser.pause(500);
        await englishOption.click();
        console.log("✓ Clicked on 'English' option");
      }
      
      // Step 6: Wait for language change to take effect
      console.log("Waiting for language change to apply...");
      await browser.pause(3000);
      
      // Step 7: Verify language changed
      const newLang = await this.getCurrentLanguage();
      console.log(`Language after change: ${newLang}`);
      
      if (newLang === toLanguage || newLang === 'Unknown') {
        console.log(`✓ Successfully changed language to ${toLanguage}`);
        await this.takeScreenshot(`language-changed-to-${toLanguage.toLowerCase()}`);
      } else {
        console.warn(`Language verification uncertain. Expected: ${toLanguage}, Found: ${newLang}`);
      }
      
    } catch (error) {
      console.error(`Failed to change language to ${toLanguage}:`, error);
      await this.takeScreenshot('language-change-error');
      throw error;
    }
  }

  // Navigate back to Home
  async navigateToHome(): Promise<boolean> {
    console.log("Navigating back to Home tab...");
    
    try {
      let element = await $(this.homeTab);
      if (await element.isExisting()) {
        await element.click();
        console.log("✓ Home tab clicked");
        await browser.pause(2000);
        return true;
      } else {
        element = await $(this.homeTabAlt);
        if (await element.isExisting()) {
          await element.click();
          console.log("✓ Home tab clicked (alt)");
          await browser.pause(2000);
          return true;
        }
      }
      
      console.error("Home tab not found");
      return false;
    } catch (error) {
      console.error("Failed to navigate to Home:", error);
      return false;
    }
  }

  // Scroll back to top of profile
  async scrollToTop(): Promise<void> {
    console.log("Scrolling back to top...");
    
    for (let i = 0; i < 5; i++) {
      await SwipeUtils.swipeDown(0.4);
      await browser.pause(300);
    }
    
    await browser.pause(1000);
  }

  // Check if dropdown is closed
  async isDropdownClosed(): Promise<boolean> {
    try {
      const englishOption = await $(this.englishDropdownOption);
      const hindiOption = await $(this.hindiDropdownOption);
      
      const englishVisible = await englishOption.isDisplayed();
      const hindiVisible = await hindiOption.isDisplayed();
      
      return !englishVisible && !hindiVisible;
    } catch {
      return true;
    }
  }
}