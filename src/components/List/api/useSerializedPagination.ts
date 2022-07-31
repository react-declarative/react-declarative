import { useMemo, useState, useEffect } from 'react';

import IAnything from "../../../model/IAnything";
import IListProps from "../../../model/IListProps";
import IRowData from "../../../model/IRowData";
import { stringifyBase64Json } from '../../../utils/base64Json';

import { DEFAULT_PARSE_RESULT, IParseResult } from "./useParsedPagination";

export interface IResultListProps <
    FilterData extends IAnything = IAnything,
    RowData extends IRowData = IAnything,
> {
    onFilterChange: IListProps<FilterData, RowData>['onFilterChange'];
    onLimitChange: IListProps<FilterData, RowData>['onLimitChange'];
    onPageChange: IListProps<FilterData, RowData>['onPageChange'];
    onSortModelChange: IListProps<FilterData, RowData>['onSortModelChange'];
    onChipsChange: IListProps<FilterData, RowData>['onChipsChange'];
    onSearchChange: IListProps<FilterData, RowData>['onSearchChange'];
    onChange?: (pagination: string) => void;
}

interface IResult<
    FilterData extends IAnything = IAnything,
    RowData extends IRowData = IAnything,
> {
    listProps: IResultListProps<FilterData, RowData>;
    serializedPagination: string;
}

export interface IParams<
    FilterData extends IAnything = IAnything,
    RowData extends IRowData = IAnything,
> extends
    Partial<IParseResult<FilterData, RowData>>,
    Partial<IResultListProps<FilterData, RowData>> {
}

export const useSerializedPagination = <
    FilterData extends IAnything = IAnything,
    RowData extends IRowData = IAnything,
>({
    chipData = DEFAULT_PARSE_RESULT.chipData,
    filterData = DEFAULT_PARSE_RESULT.filterData,
    limit = DEFAULT_PARSE_RESULT.limit,
    page = DEFAULT_PARSE_RESULT.page,
    search = DEFAULT_PARSE_RESULT.search,
    sortModel = DEFAULT_PARSE_RESULT.sortModel,
    ...otherProps
}: IParams<FilterData, RowData> = {}): IResult<FilterData, RowData> => {

    const [state, setState] = useState<IParseResult<FilterData, RowData>>({
        chipData,
        filterData,
        limit,
        page,
        search,
        sortModel
    });

    const {
        onFilterChange: handleFilterChange = () => null,
        onLimitChange: handleLimitChange = () => null,
        onPageChange: handlePageChange = () => null,
        onSortModelChange: handleSortModelChange = () => null,
        onChipsChange: handleChipsChange = () => null,
        onSearchChange: handleSeachChange = () => null,
        onChange: handleChange = () => null,
    } = otherProps;

    const onFilterChange: IResultListProps<FilterData, RowData>['onFilterChange'] = (filterData) => {
        setState((prevState) => ({
            ...prevState,
            filterData
        }));
        handleFilterChange(filterData)
    };
    
    const onLimitChange: IResultListProps<FilterData, RowData>['onLimitChange'] = (limit) => {
        setState((prevState) => ({
            ...prevState,
            limit
        }));
        handleLimitChange(limit);
    };

    const onPageChange: IResultListProps<FilterData, RowData>['onPageChange'] = (page) => {
        setState((prevState) => ({
            ...prevState,
            page
        }));
        handlePageChange(page);
    };

    const onSortModelChange: IResultListProps<FilterData, RowData>['onSortModelChange'] = (sortModel) => {
        setState((prevState) => ({
            ...prevState,
            sortModel
        }));
        handleSortModelChange(sortModel);
    };

    const onChipsChange: IResultListProps<FilterData, RowData>['onChipsChange'] = (chipData) => {
        setState((prevState) => ({
            ...prevState,
            chipData
        }));
        handleChipsChange(chipData);
    };

    const onSearchChange: IResultListProps<FilterData, RowData>['onSearchChange'] = (search) => {
        setState((prevState) => ({
            ...prevState,
            search
        }));
        handleSeachChange(search);
    };

    const serializedPagination = useMemo(() => {
        return stringifyBase64Json(state);
    }, [state]);

    useEffect(() => {
        handleChange(serializedPagination);
    }, [serializedPagination]);

    return {
        listProps: {
            onFilterChange,
            onLimitChange,
            onPageChange,
            onSortModelChange,
            onChipsChange,
            onSearchChange,
        },
        serializedPagination,
    };
};

export default useSerializedPagination;
