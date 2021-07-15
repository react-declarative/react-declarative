export const computeStyle = (() => {
    const div = document.createElement('div');
    div.style.position = 'fixed';
    div.style.left = `-${window.innerWidth}px`;
    div.style.zIndex = '9999';
    document.body.appendChild(div);
    return (width: string): number => {
        div.style.width = width;
        return parseFloat(window.getComputedStyle(div).width);
    };
})();

export default computeStyle;
