let overrideRef: ((text: string) => (Promise<void> | void)) | null = null

export const copyToClipboard = async (text: string) => {
    let isOk = true;
    try {
        if (overrideRef) {
            await overrideRef(text);
        } else {
            await navigator.clipboard.writeText(text);
        }
    } catch (error) {
        console.error(error);
        isOk = false;
    } finally {
        return isOk;
    }
}

copyToClipboard.override = (ref: (text: string) => (void | Promise<void>)) => {
    overrideRef = ref;
};

export default copyToClipboard
