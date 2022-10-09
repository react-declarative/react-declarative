import { useMemo } from "react";

import IAnything from "../../../model/IAnything";
import IListProps from "../../../model/IListProps";
import IRowData from "../../../model/IRowData";

import { parseBase64Json } from "../../../utils/base64Json";

import { DEFAULT_LIMIT, DEFAULT_PAGE } from "../config";

export interface IParseResult<
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

export type IParams<
    FilterData extends {} = IAnything,
    RowData extends IRowData = IAnything,
> = IParseResult<FilterData, RowData>;

export const DEFAULT_PARSE_RESULT: IParseResult = {
    filterData: {},
    sortModel: [],
    chipData: {},
    limit: DEFAULT_LIMIT,
    page: DEFAULT_PAGE,
    search: "",
};

export const useParsedPagination = <
    FilterData extends {} = IAnything,
    RowData extends IRowData = IAnything,
>(query: string, {
    filterData: defaultFilterData = DEFAULT_PARSE_RESULT.filterData,
    sortModel: defaultSortModel = DEFAULT_PARSE_RESULT.sortModel,
    chipData: defaultChips = DEFAULT_PARSE_RESULT.chipData,
    limit: defaultLimit = DEFAULT_PARSE_RESULT.limit,
    page: defaultPage = DEFAULT_PARSE_RESULT.page,
    search: defaultSearch = DEFAULT_PARSE_RESULT.search,
}: Partial<IParams<FilterData, RowData>> = {}): IParseResult<FilterData, RowData> => {
    return useMemo(() => {
        const defaultParseResult = {
            filterData: defaultFilterData,
            sortModel: defaultSortModel,
            chipData: defaultChips,
            limit: defaultLimit,
            page: defaultPage,
            search: defaultSearch,
        };
        const {
            filterData = defaultParseResult.filterData,
            sortModel = defaultParseResult.sortModel,
            chipData = defaultParseResult.chipData,
            limit = defaultParseResult.limit,
            page = defaultParseResult.page,
            search = defaultParseResult.search,
        } = parseBase64Json(query) || {};
        return {
            filterData,
            sortModel,
            chipData,
            limit,
            page,
            search
        };
    }, []);
};

export default useParsedPagination;
