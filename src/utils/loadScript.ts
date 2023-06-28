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
