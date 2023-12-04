const CLEANUP_DELAY = 300_000;

export const chooseFile = (accept?: string) => new Promise<File | null>((res) => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file')
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
        res(files[0])
        input.value = '';
    }
    setTimeout(() => {
        if (isCanceled) {
            if (document.body.contains(input)) {
                document.body.removeChild(input);
            }
            res(null);
        }
    }, CLEANUP_DELAY);
    window.addEventListener('focus', () => {
        setTimeout(() => {
            if (isCanceled) {
                if (document.body.contains(input)) {
                    document.body.removeChild(input);
                }
                res(null);
            }
        }, 300)
    }, { once: true })
    input.click();
});

export default chooseFile;
