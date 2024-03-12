/**
 * Waits for the size of the provided element to be non-zero.
 *
 * @param {HTMLElement} ref - The element to wait for the size to be non-zero.
 * @returns {Promise<void>} - A promise that resolves when the size is non-zero.
 */
export const waitForSize = (ref: HTMLElement) => new Promise<void>((res) => {
    const interval = setInterval(() => {
        const { height, width } = ref.getBoundingClientRect();
        if (height || width) {
            clearInterval(interval);
            res();
        }
    }, 50);
});

export default waitForSize;
