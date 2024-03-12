let overrideRef: ((url: string, name: string) => void) | null = null

/**
 * Downloads a file from the given URL with the specified name.
 * If overrideRef is defined, it will be invoked before initiating the download.
 * The file will be downloaded in a new browser tab or window.
 *
 * @param url - The URL of the file to download.
 * @param name - The name to be used for the downloaded file.
 * @returns
 */
export const downloadBlank = (url: string, name: string) => {
    if (overrideRef) {
        overrideRef(url, name);
        return;
    }
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    a.style.display = 'none';
    a.target = "_blank";
    document.body.appendChild(a);
    a.addEventListener('click', () => queueMicrotask(() => {
        URL.revokeObjectURL(url);
    }), {
        once: true,
    });
    a.click();
}

downloadBlank.override = (ref: (url: string, name: string) => void) => {
    overrideRef = ref;
};

export default downloadBlank;
