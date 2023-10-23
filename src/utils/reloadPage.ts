let isReloading = false;

let overrideRef: (() => void) | null = null

export const reloadPage = async () => {
    isReloading = true;
    if (overrideRef) {
        overrideRef();
        return;
    }
    const { href, origin, protocol } = window.location;
    if (protocol !== 'file:') {
        const url = new URL(href, origin);
        url.pathname = '/';
        url.search = '';
        url.hash = '';
        window.location.href = url.toString();
    } else {
        window.location.reload();
    }
};

if (window && window.addEventListener) {
    window.addEventListener('beforeunload', (event) => {
        if (isReloading) {
            event.stopImmediatePropagation();
        }
    }, true);
}

reloadPage.override = (ref: () => void) => {
    overrideRef = ref;
};

export default reloadPage;
