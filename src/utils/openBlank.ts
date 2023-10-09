let overrideRef: ((url: string) => void) | null = null

export const openBlank = (url: string) => {
    if (overrideRef) {
        overrideRef(url);
        return;
    }
    const a = document.createElement('a');
    a.href = url;
    a.target = '_blank';
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

openBlank.override = (ref: (url: string) => void) => {
    overrideRef = ref;
};

export default openBlank;
