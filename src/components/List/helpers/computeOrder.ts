import DisplayMode from "../../../model/DisplayMode";
import IColumn from "../../../model/IColumn";

import constraintManager from "./constraintManager";

interface IComputeOrderParams {
    column: IColumn;
    mode: DisplayMode;
    fullWidth: number;
    idx: number;
}

export const computeOrder = ({
    fullWidth,
    column,
    mode,
    idx,
}: IComputeOrderParams) => {
    const compute = () => {
        let order = 0;
        if (mode === DisplayMode.Desktop) {
            order = column.desktopOrder || 0;
        } else if (mode === DisplayMode.Tablet) {
            order = column.desktopOrder || 0;;
        } else if (mode === DisplayMode.Phone) {
            order = column.phoneOrder || 0;
        }
        return order;
    };
    return constraintManager.memoize(`column-order-${fullWidth}-${idx}`, compute) as number;
};

export default computeOrder;
