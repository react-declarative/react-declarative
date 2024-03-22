/**
 * Calculates the width of the scrollbar in the current browser.
 *
 * @returns The width of the scrollbar in pixels.
 */
export const getScrollbarWidth = () => {
    const outer = document.createElement('div');
    outer.style.position = 'fixed';
    outer.style.left = '-100%';
    outer.style.visibility = 'hidden';
    outer.style.overflow = 'scroll';
    document.body.appendChild(outer);
    const inner = document.createElement('div');
    outer.appendChild(inner);
    const scrollbarWidth = (outer.offsetWidth - inner.offsetWidth);
    document.body.removeChild(outer);
    return scrollbarWidth;
};
