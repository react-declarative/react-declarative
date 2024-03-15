import DisplayMode from "../../..//model/DisplayMode";
import IColumn from "../../..//model/IColumn";
import { ListHandlerPagination, ListHandlerSortModel } from "../../../model/IListProps";

interface IComputeParams {
    column: IColumn;
    mode: DisplayMode;
    fullWidth: number;
    idx: number;
    visibilityRequest: IVisibilityRequest;
}

export interface IParams {
    columns: IColumn[];
    fullWidth: number;
    mode: DisplayMode;
    visibilityRequest: IVisibilityRequest;
}

type Key = string | number | symbol;

export interface IVisibilityRequest {
    filterData: Record<string, any>;
    pagination: ListHandlerPagination;
    sortModel: ListHandlerSortModel<any>;
    chips: Record<Key, boolean | undefined>;
    search: string;
    payload: any;
}

const CHECKBOX_WIDTH = 75;
const CELL_PADDING_LEFT = 32;

type Dimension = string | number | boolean;

/**
 * Creates a constraint manager to memoize computed values based on column constraints.
 * @returns An object containing the constraint manager and a method to wrap columns.
 */
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

    
    const computeVisibility = ({
        column,
        fullWidth,
        visibilityRequest,
        idx,
    }: IComputeParams) => {
        const compute = () => {
            let value = true;
            if (column.isVisible) {
                value = column.isVisible(visibilityRequest);
            }
            return value;
        };
        return constraintManager.memoize(`column-visibility-${fullWidth}-${idx}`, compute);
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
        const rowWidth = Math.max(fullWidth - CHECKBOX_WIDTH, 1);
        const compute = () => {
            const field = column.width;
            const result = typeof field === 'function' ? field(rowWidth) : field;
            return typeof result === 'number' ? `${result}px` : result;
        };
        return constraintManager.memoize(`column-width-${fullWidth}-${idx}`, compute) as string;
    };

    const wrapColumns = ({
        columns,
        fullWidth,
        mode,
        visibilityRequest,
    }: IParams) => columns
        .filter((column, idx) => computeVisibility({
            visibilityRequest,
            column,
            fullWidth,
            mode,
            idx,
        }))
        .filter((column, idx) => !computeHidden({
            visibilityRequest,
            column,
            fullWidth,
            mode,
            idx,
        }))
        .map((column, idx) => [column, idx] as const)
        .sort(([col1, idx1], [col2, idx2]) => {
            const order1 = computeOrder({
                visibilityRequest,
                fullWidth,
                column: col1,
                idx: idx1,
                mode,
            }) + idx1 - (idx1 > idx2 ? 1 : 0);
            const order2 = computeOrder({
                visibilityRequest,
                fullWidth,
                column: col2,
                idx: idx2,
                mode,
            }) + idx2 - (idx2 > idx1 ? 1 : 0);
            return order1 - order2;
        })
        .map(([col]) => col)
        .map((column, idx, { length }) => ({
            ...column,
            width: computeWidth({
                visibilityRequest,
                fullWidth: fullWidth - (length * CELL_PADDING_LEFT),
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
