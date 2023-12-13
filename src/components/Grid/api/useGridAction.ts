import useGridSelection from "./useGridSelection";
import useAsyncAction from "../../../hooks/useAsyncAction";

import IAnything from "../../../model/IAnything";

interface IParams<Data extends IAnything = IAnything> {
    fetchRow: (id: string) => (Data | Promise<Data>);
    onAction: (action: string, rows: Data[], deselectAll: () => void) => (Promise<void> | void);
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
}: IParams<Data>) => {
    const { deselectAll, gridProps, selectedRows } = useGridSelection();

    const { execute: commitAction } = useAsyncAction(async (action: string) => {
        const rows = await Promise.all(selectedRows.map(fetchRow));
        await onAction(action, rows, deselectAll);
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
    } as const;
};

export default useGridAction;
