import Subject from "./rx/Subject";

let isReloading = false;

let overrideRef: (() => void) | null = null

declare global {
    /**
     * Represents a location reload callback with clear cache argument.
     * @interface
     */
    interface Location {
        reload(forceReload: boolean): void;
    }
}

const reloadSubject = new Subject<void>();

/**
 * Reloads the current page.
 *
 * @returns A promise that resolves when the page has reloaded.
 */
export const reloadPage = async () => {
    await reloadSubject.next();
    isReloading = true;
    if (overrideRef) {
        overrideRef();
        return;
    }
    const { href, origin, protocol } = window.location;
    if ('caches' in window) {
        for (const cache of await window.caches.keys()) {
            await caches.delete(cache);
        }
    }
    if (protocol !== 'file:') {
        const url = new URL(href, origin);
        url.pathname = '/';
        url.search = '';
        url.hash = '';
        window.location.href = url.toString();
    } else {
        window.location.reload(true);
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

reloadPage.listen = (fn: () => void) => reloadSubject.subscribe(fn);

export default reloadPage;
