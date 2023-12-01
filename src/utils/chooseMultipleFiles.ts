const CLEANUP_DELAY = 10_000;

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
        document.body.removeChild(input);
        isCanceled = false;
        const files = input.files;
        if (!files?.length) {
          return;
        }
        res([...files])
        input.value = '';
    }
    setTimeout(() => {
        if (isCanceled) {
            document.body.removeChild(input);
            res(null);
        }
    }, CLEANUP_DELAY);
    input.click();
});

export default chooseMultipleFiles;
