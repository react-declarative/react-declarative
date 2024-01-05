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
