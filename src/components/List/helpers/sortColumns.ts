import IColumn from "../../../model/IColumn";
import DisplayMode from "../../../model/DisplayMode";

import computeOrder from "./computeOrder";

interface IParams {
    columns: IColumn[];
    fullWidth: number;
    mode: DisplayMode;
}

export const sortColumns = ({
    columns,
    fullWidth,
    mode,
}: IParams) => columns
    .map((column, idx) => [column, idx] as const)
    .sort(([col1, idx1], [col2, idx2]) => {
        const order1 = computeOrder({
            fullWidth,
            column: col1,
            idx: idx1,
            mode,
        }) + idx1 - (idx1 > idx2 ? 1 : 0);
        const order2 = computeOrder({
            fullWidth,
            column: col2,
            idx: idx2,
            mode,
        }) + idx2 - (idx2 > idx1 ? 1 : 0);
        return order1 - order2;
    })
    .map(([col]) => col);

export default sortColumns;
