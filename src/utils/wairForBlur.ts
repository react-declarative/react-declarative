/**
 * Waits for an element to lose focus or to be removed from the body.
 *
 * @param ref - The reference element to wait for its blur.
 * @param debounce - The debounce time in milliseconds (optional, default is 50).
 *
 * @returns - A promise that resolves when the blur condition is met.
 */
export const waitForBlur = (ref: HTMLElement, debounce = 50) =>
  new Promise<void>((res) => {
    const interval = setInterval(() => {
      let isResolved = document.activeElement !== ref && !ref.contains(document.activeElement);
      isResolved = isResolved || !document.body.contains(ref);
      if (isResolved) {
        clearInterval(interval);
        res();
      }
    }, debounce);
  });

export default waitForBlur;
