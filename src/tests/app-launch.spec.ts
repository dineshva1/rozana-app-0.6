import { expect, browser } from "@wdio/globals";

describe("App Launch Test", () => {
  it("should launch the app successfully", async () => {
    console.log("Test: App launch verification");
    
    // Wait for app to load
    await browser.pause(5000);
    
    // Check if any element exists (basic check)
    const element = await browser.$("//android.widget.EditText");
    const exists = await element.isExisting();
    
    expect(exists).toBe(true);
    console.log("✅ App launched successfully");
  });
});