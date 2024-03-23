import useListSelection from "./useListSelection";
import useAsyncAction from "../../../hooks/useAsyncAction";

import IRowData, { RowId } from "../../../model/IRowData";

/**
 * Interface for defining parameters for a specific operation.
 *
 * @template Data - The type of row data used in the operation.
 */
interface IParams<Data extends IRowData = IRowData> {
    fetchRow: (id: RowId) => (Data | Promise<Data>);
    onAction?: (action: string, rows: Data[], deselectAll: () => void) => (Promise<void> | void);
    onRowAction?: (action: string, row: Data, deselectAll: () => void) => (Promise<void> | void);
    onLoadStart?: () => void;
    onLoadEnd?: (isOk: boolean) => void;
    throwError?: boolean;
    fallback?: (e: Error) => void;
}

/**
 * Provides a set of actions and hooks for managing a list of data.
 *
 * @template Data - The type of the data in the list.
 *
 * @param params - The parameters for configuring the list actions.
 * @param params.onLoadStart - The function to be called when data loading starts.
 * @param params.onLoadEnd - The function to be called when data loading ends.
 * @param params.throwError - The function to be called when an error occurs.
 * @param params.fallback - The function to be called when data loading fails.
 * @param params.fetchRow - The function to fetch a single row of data.
 * @param params.onAction - The function to be called when a bulk action is performed.
 * @param params.onRowAction - The function to be called when a row action is performed.
 *
 * @returns - The list actions and necessary data.
 */
export const useListAction = <Data extends IRowData = IRowData>({
    onLoadStart,
    onLoadEnd,
    throwError,
    fallback,
    fetchRow,
    onAction,
    onRowAction,
}: IParams<Data>) => {
    const { deselectAll, listProps, selectedRows } = useListSelection();

    /**
     * Represents the action to be performed on a commit operation.
     *
     * @typedef {Object} CommitAction
     * @property {string} type - The type of action to be performed.
     * @property {string} message - The commit message describing the action.
     * @property {string} author - The author of the commit.
     * @property {number} timestamp - The timestamp of when the commit was made.
     */
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

    /**
     * Represents an action performed on a row in a commit.
     *
     * @typedef {Object} CommitRowAction
     * @property {string} rowId - The unique identifier of the row.
     * @property {string} action - The action performed on the row (e.g., 'add', 'update', 'delete').
     * @property {Object} rowData - The data of the row.
     * @property {string} [userId] - The user who performed the action. (Optional)
     * @property {Date} timestamp - The timestamp when the action was performed.
     */
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
        listProps,
        commitAction,
        commitRowAction: (action: string, row: Data) => commitRowAction({ action, row }),
    } as const;
};

export default useListAction;
