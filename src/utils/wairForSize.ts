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
