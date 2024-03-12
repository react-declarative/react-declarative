const toBlob = (src: string) => new Promise<Blob>((res) => {
    const img = document.createElement('img');
    const c = document.createElement("canvas");
    const ctx = c.getContext("2d");
    img.onload = ({ target }: any) => {
        c.width = target.naturalWidth;
        c.height = target.naturalHeight;
        ctx!.drawImage(target, 0, 0);
        c.toBlob((b) => res(b!), "image/png", 1.0);
    };
    img.crossOrigin = "";
    img.src = src;
});

const cacheManager = new class {
    _cacheMap = new Map<string, Promise<Blob>>();
    createPromise = (url: string) => {
        if (!this._cacheMap.has(url)) {
            this._cacheMap.set(url, toBlob(url));
        }
        return this._cacheMap.get(url)!;
    };
};

/**
 * Sets the image source of a given HTMLImageElement by caching the image.
 * @param url - The URL of the image to cache.
 * @returns - A function that takes an HTMLImageElement as input and sets its source with the cached image.
 */
export const cacheSrc = (url: string) => ({
    ref: (element: HTMLImageElement | null) => {
        if (element) {
            element.style.visibility = 'hidden';
            cacheManager.createPromise(url).then((blob) => {
                if (document.contains(element)) {
                    element.src = URL.createObjectURL(blob);
                    element.style.visibility = 'visible';
                }
            })
        }
    }
});

export default cacheSrc;
