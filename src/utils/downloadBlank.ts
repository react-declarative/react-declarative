let overrideRef: ((url: string, name: string) => void) | null = null

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
