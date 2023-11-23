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
