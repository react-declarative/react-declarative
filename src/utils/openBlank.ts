import Subject from "./rx/Subject";

let overrideRef: ((url: string) => void) | null = null

const emitSubject = new Subject<string>();

/**
 * Opens the given URL in a new browser tab.
 *
 * @param url - The URL to open in a new tab.
 *
 * @returns
 */
export const openBlank = async (url: string) => {
    await emitSubject.next(url);
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

openBlank.listen = (fn: (url: string) => void) => emitSubject.subscribe(fn);

export default openBlank;
