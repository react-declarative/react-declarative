/**
 * Prevents browser history swipe gestures.
 *
 * This function adds an event listener to the `touchstart` event and checks if the touch event occurs
 * at the edges of the screen. If a touch event occurs at the left or right 10% of the screen width,
 * it prevents the default behavior which could trigger browser history swipe gestures.
 *
 * @return The function to remove the event listener.
 */
export const preventBrowserHistorySwipeGestures = () => {
  /**
   * Event handler for touch start event.
   * Prevents default behavior of the event if touch is within 10% of window width from either side.
   *
   * @param event - The touch start event object.
   */
  const touchStart = (event: TouchEvent) => {
    if (event.touches.length === 1) {
      const touch = event.touches[0];
      if (
        touch.clientX < window.innerWidth * 0.1 ||
        touch.clientX > window.innerWidth * 0.9
      ) {
        event.preventDefault();
      }
    }
  }
  window.addEventListener("touchstart", touchStart, { passive: false });
  return () => window.removeEventListener("touchstart", touchStart);
}

export default preventBrowserHistorySwipeGestures;
