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
    fullWidth,
    column,
    idx,
}: IComputeWidthParams) => {
    const compute = () => {
        const field = column.width;
        return typeof field === 'function' ? field(fullWidth) : field;
    };
    return constraintManager.memoize(`column-width-${fullWidth}-${idx}`, compute) as React.CSSProperties['width'];
};

export default computeWidth;
