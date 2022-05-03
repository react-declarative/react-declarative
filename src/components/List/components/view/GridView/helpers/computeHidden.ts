import DisplayMode from "../../../../../../model/DisplayMode";
import IColumn from "../../../../../../model/IColumn";

import constraintManager from "./constraintManager";

interface IComputeHiddenParams {
    column: IColumn;
    mode: DisplayMode;
    idx: number;
}

export const computeHidden = ({
    column,
    mode,
    idx,
}: IComputeHiddenParams) => {

    const compute = () => {

        let field: IColumn['hidden'];

        if (mode === DisplayMode.Desktop) {
            field = column.desktopHidden || column.hidden;
        } else if (mode === DisplayMode.Tablet) {
            field = column.tabletHidden || column.hidden;
        } else if (mode === DisplayMode.Phone) {
            field = column.phoneHidden || column.hidden;
        } else {
            field = column.hidden;
        }

        return !field;
    };

    return constraintManager.memoize(`column-hidden-${idx}`, compute);
};

export default computeHidden;
