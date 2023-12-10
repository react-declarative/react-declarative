import { useEffect } from 'react';

import useSinglerunAction from '../../../hooks/useSinglerunAction';
import useActualCallback from '../../../hooks/useActualCallback';
import useQueuedAction from "../../../hooks/useQueuedAction";
import useActualState from "../../../hooks/useActualState";
import useActualValue from '../../../hooks/useActualValue';
import useSubject from "../../../hooks/useSubject";

import RowData from "../model/RowData";
import TSubject from "../../../model/TSubject";

const DEFAULT_LIMIT = 25;

interface IParams<Data = RowData> {
    reloadSubject?: TSubject<void>;
    initialData?: Data[];
    handler: (limit: number, offset: number, initial: boolean) => (Data[] | Promise<Data[]>);
    limit?: number;
    onLoadStart?: () => void;
    onLoadEnd?: (isOk: boolean) => void;
    fallback?: (error: Error) => void;
    throwError?: boolean;
}

interface IState<Data = RowData> {
    data: Data[];
    prevOffset: number;
    hasMore: boolean;
}

export const useOffsetPaginator = <Data extends RowData = RowData>({
    reloadSubject: upperReloadSubject,
    initialData = [],
    handler,
    limit = DEFAULT_LIMIT,
    ...queryProps
}: IParams<Data>) => {

    const reloadSubject = useSubject(upperReloadSubject);

    const [state, setState] = useActualState<IState<Data>>(() => ({
        data: initialData,
        prevOffset: -limit,
        hasMore: true,
    }));

    const initialData$ = useActualValue(initialData);
    const handler$ = useActualCallback(handler);

    const { execute: fetchData } = useQueuedAction(async (initial: boolean) => {
        return await handler$(limit, state.current.prevOffset + limit, initial);
    });

    const { execute: onSkip, loading, error } = useSinglerunAction(async (initial: boolean) => {
        const nextData = await fetchData(initial);
        if (!nextData) {
            return;
        }
        setState({
            prevOffset: state.current.prevOffset + limit,
            data: [...state.current.data, ...nextData],
            hasMore: nextData.length >= limit,
        });
    }, queryProps);

    useEffect(() => reloadSubject.subscribe(() => {
        fetchData.cancel();
        onSkip.clear();
        setState({
            data: initialData$.current,
            hasMore: true,
            prevOffset: -limit,
        });
        onSkip(true);
    }), []);

    return {
        data: state.current.data,
        setData: setState,
        offset: state.current.prevOffset + limit,
        hasMore: state.current.hasMore,
        loading,
        error,
        onSkip,
    };
}

export default useOffsetPaginator;
