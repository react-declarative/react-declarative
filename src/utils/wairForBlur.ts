export const waitForBlur = (ref: HTMLElement) =>
  new Promise<void>((res) => {
    const interval = setInterval(() => {
      let isResolved = document.activeElement !== ref && !ref.contains(document.activeElement);
      isResolved = isResolved || !document.body.contains(ref);
      if (isResolved) {
        clearInterval(interval);
        res();
      }
    }, 50);
  });

export default waitForBlur;
