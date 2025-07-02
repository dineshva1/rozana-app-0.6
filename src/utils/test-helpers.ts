// src/utils/test-helpers.ts
import { browser } from "@wdio/globals";
import fs from 'fs';
import path from 'path';

export class TestHelpers {
  static async waitForApp(ms: number = 3000): Promise<void> {
    await browser.pause(ms);
  }
  
  static async takeScreenshot(name: string): Promise<void> {
    const screenshotDir = path.join(process.cwd(), 'screenshots');
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(screenshotDir)) {
      fs.mkdirSync(screenshotDir, { recursive: true });
    }
    
    await browser.saveScreenshot(`./screenshots/${name}.png`);
  }
  
  static formatTestLog(message: string): string {
    return `\n${message}`;
  }
  
  static formatSuccessLog(message: string): string {
    return `✅ ${message}`;
  }
  
  static formatErrorLog(message: string): string {
    return `❌ ${message}`;
  }
  
  static formatWarningLog(message: string): string {
    return `⚠️ ${message}`;
  }
}