export const waitForBlur = (ref: HTMLElement) => new Promise<void>((res) => {
    const interval = setInterval(() => {
        /**
         * Для поддержки группы полей, также проверяем наличие родителя сквозь
         * вложенность через HTMLElement.prototype.contains()
         */
        if (document.activeElement !== ref && !ref.contains(document.activeElement)) {
            clearInterval(interval);
            res();
        }
    }, 50);
});

export default waitForBlur;
