/**
 * Calculates the height of the scrollbar in the current browser.
 *
 * @returns The height of the scrollbar in pixels.
 */
export const getScrollbarHeight = () => {
    const outer = document.createElement('div');
    outer.style.position = 'fixed';
    outer.style.left = '-100%';
    outer.style.visibility = 'hidden';
    outer.style.overflow = 'scroll';
    document.body.appendChild(outer);
    const inner = document.createElement('div');
    outer.appendChild(inner);
    const scrollbarHeight = (outer.offsetHeight - inner.offsetHeight);
    document.body.removeChild(outer);
    return scrollbarHeight;
};
