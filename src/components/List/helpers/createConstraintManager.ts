import DisplayMode from "../../..//model/DisplayMode";
import IColumn from "../../..//model/IColumn";
import { ListHandlerPagination, ListHandlerSortModel } from "../../../model/IListProps";

/**
 * Represents the parameters required to compute a certain column in a display mode.
 *
 * @interface
 */
interface IComputeParams {
    column: IColumn;
    mode: DisplayMode;
    fullWidth: number;
    idx: number;
    visibilityRequest: IVisibilityRequest;
}

/**
 * Represents the parameters required by a class.
 * @interface IParams
 */
export interface IParams {
    columns: IColumn[];
    fullWidth: number;
    mode: DisplayMode;
    visibilityRequest: IVisibilityRequest;
}

type Key = string | number | symbol;

/**
 * Represents a visibility request object.
 *
 * @interface IVisibilityRequest
 */
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

    /**
     * A class representing a constraint manager.
     *
     * @class
     */
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

    /**
     * Computes the hidden value for a column based on the given parameters.
     *
     * @param computeParams - The parameters for computing the hidden value.
     * @param computeParams.column - The column to compute the hidden value for.
     * @param computeParams.fullWidth - The full width of the column.
     * @param computeParams.mode - The display mode for the column.
     * @param computeParams.idx - The index of the column.
     * @returns - The computed hidden value.
     */
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

    
    /**
     * Computes the visibility of a column based on the given parameters.
     *
     * @param params - The parameters for computing the visibility.
     * @param params.column - The column of which the visibility needs to be computed.
     * @param params.fullWidth - The full width of the column.
     * @param params.visibilityRequest - The visibility request for the column.
     * @param params.idx - The index of the column.
     *
     * @returns - The computed visibility of the column.
     */
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

    /**
     * Compute the order value for a given column based on the provided parameters.
     *
     * @param fullWidth - Whether the column spans the full width of the container.
     * @param column - The column object containing order values.
     * @param mode - The display mode (Desktop, Tablet, Phone).
     * @param idx - The index of the column.
     * @returns The computed order value.
     */
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

    /**
     * Computes the width for a column based on the provided parameters.
     *
     * @param computeParams - The parameters for computing the width.
     * @param computeParams.fullWidth - The full width of the container.
     * @param computeParams.column - The column configuration object.
     * @param computeParams.idx - The index of the column.
     *
     * @returns - The computed width of the column.
     */
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

    /**
     * Filters and sorts the given columns based on the provided parameters.
     * @param params - The parameters for wrapping columns.
     * @param params.columns - The columns to be wrapped.
     * @param params.fullWidth - Indicates whether the columns should fill the full width.
     * @param params.mode - The mode to determine how the columns should be wrapped.
     * @param params.visibilityRequest - The visibility request object.
     * @returns - The filtered and sorted columns.
     */
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
