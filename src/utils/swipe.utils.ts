import { browser } from '@wdio/globals';

export class SwipeUtils {
  /**
   * Swipe up on the screen
   * @param percentage - How much to swipe (0.1 to 1.0)
   */
  static async swipeUp(percentage: number = 0.75) {
    const { width, height } = await browser.getWindowSize();
    
    await browser.performActions([{
      type: 'pointer',
      id: 'finger1',
      parameters: { pointerType: 'touch' },
      actions: [
        { type: 'pointerMove', duration: 0, x: width / 2, y: height * 0.8 },
        { type: 'pointerDown', button: 0 },
        { type: 'pointerMove', duration: 1000, x: width / 2, y: height * 0.2 },
        { type: 'pointerUp', button: 0 }
      ]
    }]);
    
    await browser.pause(500);
  }

  /**
   * Swipe down on the screen
   * @param percentage - How much to swipe (0.1 to 1.0)
   */
  static async swipeDown(percentage: number = 0.75) {
    const { width, height } = await browser.getWindowSize();
    
    await browser.performActions([{
      type: 'pointer',
      id: 'finger1',
      parameters: { pointerType: 'touch' },
      actions: [
        { type: 'pointerMove', duration: 0, x: width / 2, y: height * 0.2 },
        { type: 'pointerDown', button: 0 },
        { type: 'pointerMove', duration: 1000, x: width / 2, y: height * 0.8 },
        { type: 'pointerUp', button: 0 }
      ]
    }]);
    
    await browser.pause(500);
  }

  /**
   * Swipe left with exact coordinates
   * @param startX - Starting X coordinate
   * @param startY - Starting Y coordinate
   * @param endX - Ending X coordinate
   * @param endY - Ending Y coordinate
   * @param duration - Duration of swipe in milliseconds
   */
  static async swipeLeftExact(startX: number, startY: number, endX: number, endY: number, duration: number = 1000) {
    await browser.performActions([{
      type: 'pointer',
      id: 'finger1',
      parameters: { pointerType: 'touch' },
      actions: [
        { type: 'pointerMove', duration: 0, x: startX, y: startY },
        { type: 'pointerDown', button: 0 },
        { type: 'pointerMove', duration: duration, x: endX, y: endY },
        { type: 'pointerUp', button: 0 }
      ]
    }]);
    
    // Release actions to free up the pointer
    await browser.releaseActions();
    await browser.pause(1000);
  }

  /**
   * Swipe right with exact coordinates
   * @param startX - Starting X coordinate
   * @param startY - Starting Y coordinate
   * @param endX - Ending X coordinate
   * @param endY - Ending Y coordinate
   * @param duration - Duration of swipe in milliseconds
   */
  static async swipeRightExact(startX: number, startY: number, endX: number, endY: number, duration: number = 1000) {
    await browser.performActions([{
      type: 'pointer',
      id: 'finger1',
      parameters: { pointerType: 'touch' },
      actions: [
        { type: 'pointerMove', duration: 0, x: startX, y: startY },
        { type: 'pointerDown', button: 0 },
        { type: 'pointerMove', duration: duration, x: endX, y: endY },
        { type: 'pointerUp', button: 0 }
      ]
    }]);
    
    // Release actions to free up the pointer
    await browser.releaseActions();
    await browser.pause(1000);
  }
   static async swipeExactCoordinates(
    startX: number, 
    startY: number, 
    endX: number, 
    endY: number, 
    duration: number = 1000
  ) {
    try {
      await browser.action('pointer')
        .move({ duration: 0, x: startX, y: startY })
        .down({ button: 0 })
        .move({ duration: duration, x: endX, y: endY })
        .up({ button: 0 })
        .perform();
      
      console.log(`✓ Swiped from (${startX}, ${startY}) to (${endX}, ${endY})`);
    } catch (error) {
      console.error('Swipe failed:', error);
      throw error;
    }
  }
  
  // Your specific swipe for products
  static async swipeUpForProducts() {
    await this.swipeExactCoordinates(542, 1375, 563, 692, 1000);
  }
}