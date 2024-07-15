export const readSize = (src: string) => new Promise<{ naturalHeight: number, naturalWidth: number }>((res, rej) => {
    const img = document.createElement('img');
    img.crossOrigin = "anonymous";
    img.onload = () => {
        const { naturalHeight, naturalWidth } = img;
        res({ naturalHeight, naturalWidth });
    };
    img.onerror = () => {
        rej();
    };
    img.src = src;
});

export default readSize;
