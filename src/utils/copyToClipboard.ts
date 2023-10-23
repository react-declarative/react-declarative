let overrideRef: ((text: string) => (Promise<void> | void)) | null = null

export const copyToClipboard = async (text: string) => {
    if (overrideRef) {
        await overrideRef(text);
        return;
    }
    await navigator.clipboard.writeText(text);
}

copyToClipboard.override = (ref: (text: string) => (void | Promise<void>)) => {
    overrideRef = ref;
};

export default copyToClipboard
