import { useMemo } from 'react';

import { BrowserHistory, HashHistory, MemoryHistory } from 'history';

import useSerializedPagination, { IParams as ISerializedPaginationParams } from './useSerializedPagination';
import useParsedPagination from './useParsedPagination';

import IAnything from "../../../model/IAnything";
import IRowData from "../../../model/IRowData";

import createWindowHistory from '../../../utils/createWindowHistory';
import createHashstateManager from '../../../helpers/hashstateManager';

interface IParams<
    FilterData extends {} = IAnything,
    RowData extends IRowData = IAnything,
> extends ISerializedPaginationParams<FilterData, RowData> {
    history?: MemoryHistory | BrowserHistory | HashHistory;
};

const DEFAULT_HISTORY = createWindowHistory();

export const useHashstatePagination = <
    FilterData extends {} = IAnything,
    RowData extends IRowData = IAnything,
>({
    history = DEFAULT_HISTORY,
    onChange,
    onChipsChange,
    onFilterChange,
    onLimitChange,
    onPageChange,
    onSearchChange,
    onSortModelChange,
    ...props
}: IParams<FilterData, RowData> = {}) => {

    const hashManager = useMemo(() => createHashstateManager(history), [history]);

    const hashValue = useParsedPagination(hashManager.getValue(), props);

    const handleChange = (pagination: string) => {
        hashManager.setValue(pagination);
        onChange && onChange(pagination);
    };

    const hashCallbacks = {
        onChange: handleChange,
        onChipsChange,
        onFilterChange,
        onLimitChange,
        onPageChange,
        onSearchChange,
        onSortModelChange,
    };

    const {
        listProps,
    } = useSerializedPagination({
        ...hashValue,
        ...hashCallbacks,
    });

    listProps.onChange = undefined;

    return {
        listProps: {
            ...listProps,
            ...hashValue,
        },
    };
};

export default useHashstatePagination;
