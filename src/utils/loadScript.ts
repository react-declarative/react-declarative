/**
 * Loads an external script dynamically.
 *
 * @param src - The source URL of the script to load.
 * @param [async=false] - Whether to load the script asynchronously.
 * @returns - A promise that resolves when the script is loaded successfully, or rejects when an error occurs.
 */
export const loadScript = (src: string, async = false) =>
    new Promise<void>((res, rej) => {
        const script = document.createElement('script');
        script.crossOrigin="anonymous";

        script.addEventListener('load', () => {
            res();
        });

        script.addEventListener('error', () => {
            rej();
        });

        if (async) {
            script.async = true;
        }

        document.body.appendChild(script);
        script.src = src;
    });

export default loadScript;
