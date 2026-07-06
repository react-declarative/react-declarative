/**
 * Waits for the size of the provided element to be non-zero.
 *
 * @param ref - The element to wait for the size to be non-zero.
 * @returns - A promise that resolves when the size is non-zero.
 */
export const waitForSize = (ref: HTMLElement) => new Promise<void>((res) => {
    const interval = setInterval(() => {
        const { height, width } = ref.getBoundingClientRect();
        if (!document.body.contains(ref)) {
            clearInterval(interval);
            res();
            return;
        }
        if (height || width) {
            clearInterval(interval);
            res();
            return;
        }
    }, 50);
});

export default waitForSize;
