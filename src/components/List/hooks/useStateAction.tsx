import createValueProvider from "../../../utils/createValueProvider";

import { IRowData } from "../../../model/IRowData";
import { ListHandlerChips, ListHandlerSortModel } from "../../../model/IListProps";

import TSubject from "../../../model/TSubject";

interface IFilterDataChangedStateAction {
    type: "filterdata-changed";
    filterData: Record<string, unknown>;
    keepPagination: boolean;
}

interface IRowsChangedStateAction {
    type: "rows-changed";
    rows: IRowData[];
    total: number | null;
}

interface IChipsChangedStateAction {
    type: "chips-changed";
    chips: ListHandlerChips;
}

interface ISearchChangedStateAction {
    type: "search-changed";
    search: string;
}

interface ISortChangedStateAction {
    type: "sort-changed";
    sort: ListHandlerSortModel;
}

export type IStateAction = IFilterDataChangedStateAction | IRowsChangedStateAction | IChipsChangedStateAction | ISearchChangedStateAction | ISortChangedStateAction;

export const [StateActionProvider, useStateAction] = createValueProvider<TSubject<IStateAction>>();

export default useStateAction;
