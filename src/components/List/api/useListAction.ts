import useListSelection from "./useListSelection";
import useAsyncAction from "../../../hooks/useAsyncAction";

import IRowData, { RowId } from "../../../model/IRowData";

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
        listProps,
        commitAction,
        commitRowAction: (action: string, row: Data) => commitRowAction({ action, row }),
    } as const;
};

export default useListAction;
