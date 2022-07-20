import { useMemo } from "react";

import IAnything from "../../../model/IAnything";
import IListProps from "../../../model/IListProps";
import IRowData from "../../../model/IRowData";

import { parseBase64Json } from "../../../utils/base64Json";

import { DEFAULT_LIMIT, DEFAULT_PAGE } from "../config";

export interface IParseResult<
    FilterData extends IAnything = IAnything,
    RowData extends IRowData = IAnything,
> {
    filterData: IListProps<FilterData, RowData>['filterData'];
    sortModel: IListProps<FilterData, RowData>['sortModel'];
    chips: IListProps<FilterData, RowData>['chips'];
    limit: IListProps<FilterData, RowData>['limit'];
    page: IListProps<FilterData, RowData>['page'];
    search: IListProps<FilterData, RowData>['search'];
}

export const DEFAULT_PARSE_RESULT: IParseResult = {
    filterData: {},
    sortModel: [],
    chips: [],
    limit: DEFAULT_LIMIT,
    page: DEFAULT_PAGE,
    search: "",
};

export const useParsedPagination = <
    FilterData extends IAnything = IAnything,
    RowData extends IRowData = IAnything,
>(query: string, {
    filterData: defaultFilterData = DEFAULT_PARSE_RESULT.filterData,
    sortModel: defaultSortModel = DEFAULT_PARSE_RESULT.sortModel,
    chips: defaultChips = DEFAULT_PARSE_RESULT.chips,
    limit: defaultLimit = DEFAULT_PARSE_RESULT.limit,
    page: defaultPage = DEFAULT_PARSE_RESULT.page,
    search: defaultSearch = DEFAULT_PARSE_RESULT.search,
}: Partial<IParseResult<FilterData, RowData>> = {}): IParseResult<FilterData, RowData> => {
    return useMemo(() => {
        const defaultParseResult = {
            filterData: defaultFilterData,
            sortModel: defaultSortModel,
            chips: defaultChips,
            limit: defaultLimit,
            page: defaultPage,
            search: defaultSearch,
        };
        const {
            filterData = defaultParseResult.filterData,
            sortModel = defaultParseResult.sortModel,
            chips = defaultParseResult.chips,
            limit = defaultParseResult.limit,
            page = defaultParseResult.page,
            search = defaultParseResult.search,
        } = parseBase64Json(query) || {};
        return {
            filterData,
            sortModel,
            chips,
            limit,
            page,
            search
        };
    }, []);
};

export default useParsedPagination;
