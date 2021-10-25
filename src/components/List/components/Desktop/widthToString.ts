import IColumn from "../../../../model/IColumn";

export const widthToString = (width: IColumn['width']): string => {
    let w: string | number | (() => string | number) = width;
    if (typeof width === 'function') {
        w = width();
    }
    return typeof w === 'number' ? `${w}px` : w.toString();
};

export default widthToString;
