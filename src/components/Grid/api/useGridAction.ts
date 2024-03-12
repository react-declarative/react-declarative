import useGridSelection from "./useGridSelection";
import useAsyncAction from "../../../hooks/useAsyncAction";

import IAnything from "../../../model/IAnything";

interface IParams<Data extends IAnything = IAnything> {
    fetchRow: (id: string) => (Data | Promise<Data>);
    onAction?: (action: string, rows: Data[], deselectAll: () => void) => (Promise<void> | void);
    onRowAction?: (action: string, row: Data, deselectAll: () => void) => (Promise<void> | void);
    onLoadStart?: () => void;
    onLoadEnd?: (isOk: boolean) => void;
    throwError?: boolean;
    fallback?: (e: Error) => void;
}

/**
 * Executes grid actions and row actions.
 *
 * @template Data - The type of data in the grid rows.
 * @param {IParams<Data>} Object - The parameters for the useGridAction function.
 * @param {Function} Object.onLoadStart - A callback function executed when a grid action or row action is started.
 * @param {Function} Object.onLoadEnd - A callback function executed when a grid action or row action is completed or failed.
 * @param {boolean} Object.throwError - A flag indicating whether to throw an error if a grid action or row action fails.
 * @param {boolean} Object.fallback - A flag indicating whether to use a fallback solution if a grid action or row action fails.
 * @param {Function} Object.fetchRow - A function that fetches a row.
 * @param {Function} Object.onAction - A callback function executed when a grid action is performed. This function receives the action name, the rows to perform the action on, and a
 * deselectAll function to deselect all rows.
 * @param {Function} Object.onRowAction - A callback function executed when a row action is performed. This function receives the action name, the row to perform the action on, and a
 * deselectAll function to deselect all rows.
 * @returns {object} An object containing the following properties:
 *   - {Function} deselectAll - A function that deselects all rows in the grid.
 *   - {Array<Data>} selectedRows - An array of selected rows in the grid.
 *   - {object} gridProps - The grid properties.
 *   - {Function} commitAction - A function that commits a grid action. This function receives the action name and calls the onAction callback function with the selected rows.
 *   - {Function} commitRowAction - A function that commits a row action. This function receives the action name and the row and calls the onRowAction callback function.
 */
export const useGridAction = <Data extends IAnything = IAnything>({
    onLoadStart,
    onLoadEnd,
    throwError,
    fallback,
    fetchRow,
    onAction,
    onRowAction,
}: IParams<Data>) => {
    const { deselectAll, gridProps, selectedRows } = useGridSelection();

    const { execute: commitAction } = useAsyncAction(async (action: string) => {
        if (onAction) {
            const rows = await Promise.all(selectedRows.map(fetchRow));
            await onAction(action, rows, deselectAll);
        }
    }, {
        onLoadStart,
        onLoadEnd,
        throwError,
        fallback,
    });

    const { execute: commitRowAction } = useAsyncAction(async (dto: {
        action: string;
        row: Data;
    }) => {
        if (onRowAction) {
            await onRowAction(dto.action, dto.row, deselectAll);
        }
    }, {
        onLoadStart,
        onLoadEnd,
        throwError,
        fallback,
    });

    return {
        deselectAll,
        selectedRows,
        gridProps,
        commitAction,
        commitRowAction: (action: string, row: Data) => commitRowAction({ action, row }),
    } as const;
};

export default useGridAction;
