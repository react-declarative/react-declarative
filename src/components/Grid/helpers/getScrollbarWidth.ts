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
