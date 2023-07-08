import { useMemo } from "react";

import IAnything from "../../../model/IAnything";
import IListProps from "../../../model/IListProps";
import IRowData from "../../../model/IRowData";

import useSearchState from "../../../hooks/useSearchState";
import useActualValue from "../../../hooks/useActualValue";
import useChange from "../../../hooks/useChange";

import { DEFAULT_LIMIT, DEFAULT_PAGE } from "../config";

interface IQuery<
    FilterData extends {} = IAnything,
    RowData extends IRowData = IAnything,
> {
    filterData: IListProps<FilterData, RowData>['filterData'];
    sortModel: IListProps<FilterData, RowData>['sortModel'];
    chipData: IListProps<FilterData, RowData>['chipData'];
    limit: IListProps<FilterData, RowData>['limit'];
    page: IListProps<FilterData, RowData>['page'];
    search: IListProps<FilterData, RowData>['search'];
}

interface IParams<
    FilterData extends {} = IAnything,
    RowData extends IRowData = IAnything,
> {
    onFilterChange: IListProps<FilterData, RowData>['onFilterChange'];
    onLimitChange: IListProps<FilterData, RowData>['onLimitChange'];
    onPageChange: IListProps<FilterData, RowData>['onPageChange'];
    onSortModelChange: IListProps<FilterData, RowData>['onSortModelChange'];
    onChipsChange: IListProps<FilterData, RowData>['onChipsChange'];
    onSearchChange: IListProps<FilterData, RowData>['onSearchChange'];
    onChange?: (pagination: string) => void;
    fallback?: (e: Error) => void;
}

interface IResult<
    FilterData extends {} = IAnything,
    RowData extends IRowData = IAnything,
> extends IParams<FilterData, RowData>, IQuery<FilterData, RowData> {
}

export const DEFAULT_QUERY: IQuery = {
    filterData: {},
    sortModel: [],
    chipData: {},
    limit: DEFAULT_LIMIT,
    page: DEFAULT_PAGE,
    search: "",
};

export const useQueryPagination = <
    FilterData extends {} = IAnything,
    RowData extends IRowData = IAnything,
>(initialValue: IQuery<FilterData, RowData> = DEFAULT_QUERY, {
    onFilterChange: handleFilterChange = () => null,
    onLimitChange: handleLimitChange = () => null,
    onPageChange: handlePageChange = () => null,
    onSortModelChange: handleSortModelChange = () => null,
    onChipsChange: handleChipsChange = () => null,
    onSearchChange: handleSeachChange = () => null,
    onChange: handleChange = () => null,
    fallback,
}: Partial<IParams<FilterData, RowData>> = {}) => {

    const [state, setState] = useSearchState(() => ({
        filterData: JSON.stringify(initialValue.filterData) || "{}",
        sortModel: JSON.stringify(initialValue.sortModel) || "[]",
        chipData: JSON.stringify(initialValue.chipData) || "{}",
        limit: initialValue.limit || DEFAULT_LIMIT,
        page: initialValue.page || DEFAULT_PAGE,
        search: initialValue.search || "",
    }));

    const state$ = useActualValue(state);

    const query = useMemo<IQuery<FilterData, RowData>>(() => ({
        filterData: JSON.parse(state.filterData || "{}"),
        sortModel: JSON.parse(state.sortModel || "[]"),
        chipData: JSON.parse(state.chipData || "{}"),
        limit: state.limit || DEFAULT_LIMIT,
        page: state.page || DEFAULT_PAGE,
        search: state.search || "",
    }), [state]);

    useChange(() => {
        handleChange(JSON.stringify(state$.current));
    }, [state]);

    const onFilterChange: IResult<FilterData, RowData>['onFilterChange'] = (filterData) => {
        setState((prevState) => ({
            ...prevState,
            filterData: JSON.stringify(filterData || "{}"),
        }));
        handleFilterChange(filterData)
    };
    
    const onLimitChange: IResult<FilterData, RowData>['onLimitChange'] = (limit) => {
        setState((prevState) => ({
            ...prevState,
            limit
        }));
        handleLimitChange(limit);
    };

    const onPageChange: IResult<FilterData, RowData>['onPageChange'] = (page) => {
        setState((prevState) => ({
            ...prevState,
            page
        }));
        handlePageChange(page);
    };

    const onSortModelChange: IResult<FilterData, RowData>['onSortModelChange'] = (sortModel) => {
        setState((prevState) => ({
            ...prevState,
            sortModel: JSON.stringify(sortModel || "[]"),
        }));
        handleSortModelChange(sortModel);
    };

    const onChipsChange: IResult<FilterData, RowData>['onChipsChange'] = (chipData) => {
        setState((prevState) => ({
            ...prevState,
            chipData: JSON.stringify(chipData || "{}"),
        }));
        handleChipsChange(chipData);
    };

    const onSearchChange: IResult<FilterData, RowData>['onSearchChange'] = (search) => {
        setState((prevState) => ({
            ...prevState,
            search
        }));
        handleSeachChange(search);
    };

    return {
        listProps: {
            onFilterChange,
            onLimitChange,
            onPageChange,
            onSortModelChange,
            onChipsChange,
            onSearchChange,
            ...fallback && { fallback },
            ...query,
        },
        pagination: state,
    };
};

/*
console.log({filterData: (new URL(location.href).searchParams.get('filterData'))});
console.log({sortModel: (new URL(location.href).searchParams.get('sortModel'))});
console.log({chipData: (new URL(location.href).searchParams.get('chipData'))});
console.log({limit: (new URL(location.href).searchParams.get('limit'))});
console.log({page: (new URL(location.href).searchParams.get('page'))});
console.log({search: (new URL(location.href).searchParams.get('search'))});
*/

export default useQueryPagination;
