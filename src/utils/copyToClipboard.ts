let overrideRef: ((text: string) => (Promise<void> | void)) | null = null

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
 * @param {string} text - The text to be copied.
 * @returns {Promise<boolean>} - A promise that resolves to a boolean indicating whether the copy operation was successful.
 */
export const copyToClipboard = async (text: string) => {
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

export default copyToClipboard
