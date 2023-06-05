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
        document.body.removeChild(input);
        isCanceled = false;
        const files = input.files;
        if (!files?.length) {
          return;
        }
        res(files[0])
        input.value = '';
    }
    window.addEventListener('focus', () => {
        setTimeout(() => {
            if (isCanceled) {
                document.body.removeChild(input);
                res(null);
            }
        }, 300)
    }, { once: true })
    input.click();
});

export default chooseFile;
