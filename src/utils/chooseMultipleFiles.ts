import sleep from "./sleep";

const CLEANUP_DELAY = 1_000;
const AWAIT_DELAY = 7_000;

const waitForResume = () => new Promise<void>((res) => {
    const handler = () => {
        document.removeEventListener('mousemove', handler);
        document.removeEventListener('touchmove', handler);
        res();
    };
    sleep(AWAIT_DELAY).then(() => {
        document.addEventListener('mousemove', handler);
        document.addEventListener('touchmove', handler);
    });
});

/**
 * Creates a file chooser dialog that allows the user to select multiple files.
 *
 * @param accept - Optional MIME type filter for accepted file types.
 * @returns - A promise that resolves to an array of selected files
 * or null if the dialog was canceled.
 */
export const chooseMultipleFiles = (accept?: string) => new Promise<File[] | null>((res) => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file')
    input.setAttribute('multiple', "1"); 
    input.style.display = "none";
    if (accept) {
        input.accept = accept;
    }
    document.body.appendChild(input);
    let isCanceled = true;
    input.onchange = () => {
        if (document.body.contains(input)) {
            document.body.removeChild(input);
        }
        isCanceled = false;
        const files = input.files;
        if (!files?.length) {
          return;
        }
        res([...files])
        input.value = '';
    }
    waitForResume().then(() => {
        setTimeout(() => {
            if (isCanceled) {
                if (document.body.contains(input)) {
                    document.body.removeChild(input);
                }
                res(null);
            }
        }, CLEANUP_DELAY)
    });
    input.click();
});

export default chooseMultipleFiles;
