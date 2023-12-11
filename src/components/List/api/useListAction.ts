import useListSelection from "./useListSelection";
import useAsyncAction from "../../../hooks/useAsyncAction";

import IRowData, { RowId } from "../../../model/IRowData";

interface IParams<Data extends IRowData = IRowData> {
    fetchRow: (id: RowId) => (Data | Promise<Data>);
    onAction: (action: string, rows: Data[]) => (Promise<void> | void);
    onLoadStart?: () => void;
    onLoadEnd?: (isOk: boolean) => void;
    throwError?: boolean;
    fallback?: (e: Error) => void;
}

export const useListAction = <Data extends IRowData = IRowData>({
    onLoadStart,
    onLoadEnd,
    throwError,
    fallback,
    fetchRow,
    onAction,
}: IParams<Data>) => {
    const { deselectAll, listProps, selectedRows } = useListSelection();

    const { execute: commitAction } = useAsyncAction(async (action: string) => {
        const rows = await Promise.all(selectedRows.map(fetchRow));
        await onAction(action, rows);
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
    } as const;
};

export default useListAction;
