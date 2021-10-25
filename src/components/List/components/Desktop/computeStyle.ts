import { IColumn } from "../../../..";

import widthToString from "./widthToString";

export const computeStyle = (() => {
    const div = document.createElement('div');
    div.style.position = 'fixed';
    div.style.left = `-${window.innerWidth}px`;
    div.style.zIndex = '9999';
    document.body.appendChild(div);
    return (width: IColumn['width']): number => {
        div.style.width = widthToString(width);
        return parseFloat(window.getComputedStyle(div).width);
    };
})();

export default computeStyle;
