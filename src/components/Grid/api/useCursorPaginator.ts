import { useEffect, useMemo } from 'react';

import useActualCallback from '../../../hooks/useActualCallback';
import useQueuedAction from "../../../hooks/useQueuedAction";
import useActualState from "../../../hooks/useActualState";
import useActualValue from '../../../hooks/useActualValue';
import useSubject from "../../../hooks/useSubject";

import RowData from "../model/RowData";
import TSubject from '../../../model/TSubject';

const DEFAULT_LIMIT = 25;

interface IParams<Data = RowData> {
    reloadSubject?: TSubject<void>;
    initialData?: Data[];
    handler: (cursor: string | null, initial: boolean, limit: number) => Data[];
    limit?: number;
    onLoadStart?: () => void;
    onLoadEnd?: (isOk: boolean) => void;
    fallback?: (error: Error) => void;
    throwError?: boolean;
}

interface IState<Data = RowData> {
    data: Data[];
    hasMore: boolean;
}

export const useCursorPaginator = <Data extends RowData = RowData>({
    reloadSubject: upperReloadSubject,
    initialData = [],
    handler,
    limit = DEFAULT_LIMIT,
    ...queryProps
}: IParams<Data>) => {

    const reloadSubject = useSubject(upperReloadSubject);

    const [state, setState] = useActualState<IState<Data>>(() => ({
        data: initialData,
        hasMore: true,
    }));

    const initialData$ = useActualValue(initialData);
    const handler$ = useActualCallback(handler);

    const { execute: fetchData } = useQueuedAction(async (initial: boolean) => {
        const [lastItem = {}] = state.current.data.slice(-1);
        const { id: lastCursor = null } = lastItem as any;
        return await handler$(lastCursor, initial, limit);
    });

    const { execute: onSkip, loading, error } = useQueuedAction(async (initial: boolean) => {
        const nextData = await fetchData(initial);
        if (!nextData) {
            return;
        }
        setState({
            data: [...state.current.data, ...nextData],
            hasMore: nextData.length >= limit,
        });
    }, queryProps);

    useEffect(() => reloadSubject.subscribe(() => {
        fetchData.cancel();
        setState({
            data: initialData$.current,
            hasMore: true,
        });
        onSkip(true);
    }), []);

    const lastCursor = useMemo(() => {
        const [lastItem = {}] = state.current.data.slice(-1);
        const { id: lastCursor = null } = lastItem as any;
        return lastCursor;
    }, [state.current.data]);

    return {
        data: state.current.data,
        setData: setState,
        hasMore: state.current.hasMore,
        lastCursor,
        loading,
        error,
        onSkip,
    };
}

export default useCursorPaginator;
