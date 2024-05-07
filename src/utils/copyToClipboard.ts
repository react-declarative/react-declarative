import Subject from "./rx/Subject";

let overrideRef: ((text: string) => (Promise<void> | void)) | null = null

const emitSubject = new Subject<string>();

/**
 * Creates a textarea element, assigns the given text to its value property, appends it to the document body,
 * focuses and selects the textarea, and then tries to copy the selected text to the clipboard using the
 * `document.execCommand('copy')` method. If the copy is successful, it logs a success message to the console,
 * otherwise it logs an error message to the console.
 * Finally, it removes the textarea element from the document body.
 *
 * @param text - The text to be copied to the clipboard.
 */
const fallbackCopy = (text: string) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      const successful = document.execCommand('copy');
      const msg = successful ? 'successful' : 'unsuccessful';
      console.log('Fallback: Copying text command was ' + msg);
    } catch (err) {
      console.error('Fallback: Oops, unable to copy', err);
    }
    document.body.removeChild(textArea);
};

/**
 * Asynchronously copies text to the clipboard.
 *
 * @param text - The text to be copied to the clipboard.
 * @returns - A Promise that resolves when the text has been copied successfully or a fallback method has been used.
 */
const doCopy = async (text: string) => {
    try {
        if ('copyToClipboard' in navigator) {
            // @ts-ignore
            await window.navigator.copyToClipboard(text);
            return;
        }
        await navigator.clipboard.writeText(text);
    } catch {
        fallbackCopy(text);
    }
};

/**
 * Copies the given text to the clipboard.
 *
 * @param text - The text to be copied.
 * @returns - A promise that resolves to a boolean indicating whether the copy operation was successful.
 */
export const copyToClipboard = async (text: string) => {
    await emitSubject.next(text);
    let isOk = true;
    try {
        if (overrideRef) {
            await overrideRef(text);
        } else {
            await doCopy(text);
        }
    } catch (error) {
        console.error(error);
        isOk = false;
    } finally {
        return isOk;
    }
};

copyToClipboard.override = (ref: (text: string) => (void | Promise<void>)) => {
    overrideRef = ref;
};

copyToClipboard.listen = (fn: (text: string) => void) => emitSubject.subscribe(fn);

export default copyToClipboard
