let isReloading = false;

export const reloadPage = async () => {
    isReloading = true;
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

export default reloadPage;
