import DisplayMode from "../../..//model/DisplayMode";
import IColumn from "../../..//model/IColumn";

interface IComputeParams {
    column: IColumn;
    mode: DisplayMode;
    fullWidth: number;
    idx: number;
}

export interface IParams {
    columns: IColumn[];
    fullWidth: number;
    mode: DisplayMode;
}

type Dimension = string | number | boolean;

export const createConstraintManager = () => {

    const constraintManager = new class {
        _cache = new Map<string, Dimension>();
        memoize = (column: string, compute: () => Dimension) => {
            if (!this._cache.has(column)) {
                const value = compute();
                this._cache.set(column, value);
                return value;
            } else {
                return this._cache.get(column);
            }
        };
        clear = () => {
            this._cache.clear();
        };
    };

    const computeHidden = ({
        column,
        fullWidth,
        mode,
        idx,
    }: IComputeParams) => {
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

    const computeOrder = ({
        fullWidth,
        column,
        mode,
        idx,
    }: IComputeParams) => {
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

    const computeWidth = ({
        fullWidth,
        column,
        idx,
    }: IComputeParams) => {
        const compute = () => {
            const field = column.width;
            const result = typeof field === 'function' ? field(fullWidth) : field;
            return typeof result === 'number' ? `${result}px` : result;
        };
        return constraintManager.memoize(`column-width-${fullWidth}-${idx}`, compute) as string;
    };

    const wrapColumns = ({
        columns,
        fullWidth,
        mode,
    }: IParams) => columns
        .filter((column, idx) => !computeHidden({
            column,
            fullWidth,
            mode,
            idx,
        }))
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
        .map(([col]) => col)
        .map((column, idx) => ({
            ...column,
            width: computeWidth({
                fullWidth,
                column,
                mode,
                idx,
            }),
        }));

    return {
        constraintManager,
        wrapColumns,
    };

};

export default createConstraintManager;
