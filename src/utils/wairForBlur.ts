export const waitForBlur = (ref: HTMLElement) =>
  new Promise<void>((res) => {
    const interval = setInterval(() => {
      /**
       * Для поддержки группы полей, также проверяем наличие родителя сквозь
       * вложенность через HTMLElement.prototype.contains()
       */
      if (
        document.activeElement !== ref &&
        !ref.contains(document.activeElement)
      ) {
        clearInterval(interval);
        res();
      }
    }, 50);
    const elements = ref.querySelectorAll<HTMLInputElement>("input");
    const dispose = () => {
      clearInterval(interval);
      elements.forEach((element) =>
        element.removeEventListener("blur", dispose)
      );
      res();
    };
    elements.forEach((input) => {
      input.addEventListener("blur", dispose, {
        once: true,
      });
    });
  });

export default waitForBlur;
