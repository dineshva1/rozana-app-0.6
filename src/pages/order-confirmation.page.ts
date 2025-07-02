import { BasePage } from './base.page';
import { browser } from '@wdio/globals';

export class OrderConfirmationPage extends BasePage {
  // Selectors
  private get orderSuccessTitle() {
    return '//android.widget.TextView[contains(@text, "Order Placed Successfully")]';
  }

  private get continueShoppingButton() {
    return '//android.widget.Button[@content-desc="Continue Shopping"]';
  }

  private get orderId() {
    return '//android.widget.TextView[contains(@text, "Order ID")]';
  }

  // Verify order confirmation page
  async isOrderConfirmationDisplayed(): Promise<boolean> {
    try {
      await browser.pause(2000);
      const buttonExists = await this.isElementExisting(this.continueShoppingButton);
      return buttonExists;
    } catch {
      return false;
    }
  }

  // Continue shopping
  async continueShopping() {
    console.log("Clicking Continue Shopping...");
    await this.clickElement(this.continueShoppingButton);
    await browser.pause(3000);
    console.log("✓ Clicked Continue Shopping");
  }
}