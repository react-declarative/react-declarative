import DisplayMode from "../../..//model/DisplayMode";
import IColumn from "../../..//model/IColumn";

import constraintManager from "./constraintManager";

interface IComputeHiddenParams {
    column: IColumn;
    mode: DisplayMode;
    fullWidth: number;
    idx: number;
}

export const computeHidden = ({
    column,
    fullWidth,
    mode,
    idx,
}: IComputeHiddenParams) => {
    const compute = () => {
        let value = false;
        if (mode === DisplayMode.Desktop) {
            value = !!column.desktopHidden;
        } else if (mode === DisplayMode.Tablet) {
            value = !!column.tabletHidden;
        } else if (mode === DisplayMode.Phone) {
            value = !!column.phoneHidden;
        }
        return value;
    };
    return constraintManager.memoize(`column-hidden-${fullWidth}-${idx}`, compute);
};

export default computeHidden;
