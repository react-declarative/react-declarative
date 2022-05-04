import React from "react";

import DisplayMode from "../../../model/DisplayMode";
import IColumn from "../../../model/IColumn";

import constraintManager from "./constraintManager";

interface IComputeWidthParams {
    column: IColumn;
    mode: DisplayMode;
    fullWidth: number;
    idx: number;
}

export const computeWidth = ({
    column,
    mode,
    fullWidth,
    idx,
}: IComputeWidthParams) => {

    const compute = () => {

        let field: IColumn['width'];

        if (mode === DisplayMode.Desktop) {
            field = column.desktopWidth || column.width;
        } else if (mode === DisplayMode.Tablet) {
            field = column.tabletWidth || column.width;
        } else if (mode === DisplayMode.Phone) {
            field = column.phoneWidth || column.width;
        } else {
            field = column.width;
        }

        return typeof field === 'function' ? field(fullWidth) : (field || '200px');
    };

    return constraintManager.memoize(`column-width-${fullWidth}-${idx}`, compute) as React.CSSProperties['width'];
};

export default computeWidth;
