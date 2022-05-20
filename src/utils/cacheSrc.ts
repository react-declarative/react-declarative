const toBlob = (src: string) => new Promise<Blob>((res) => {
    const img = document.createElement('img');
    const c = document.createElement("canvas");
    const ctx = c.getContext("2d");
    img.onload = ({ target }: any) => {
        c.width = target.naturalWidth;
        c.height = target.naturalHeight;
        ctx!.drawImage(target, 0, 0);
        c.toBlob((b) => res(b!), "image/png", 0.75);
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

export const cacheSrc = (url: string) => ({
    ref: (element: HTMLImageElement) =>
        cacheManager.createPromise(url).then((blob) => {
            element.src = URL.createObjectURL(blob);
        })
});

export default cacheSrc;
