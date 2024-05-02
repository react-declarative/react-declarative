import createValueProvider from "../../../utils/createValueProvider";

import { IRowData } from "../../../model/IRowData";
import { ListHandlerChips, ListHandlerSortModel } from "../../../model/IListProps";

import TSubject from "../../../model/TSubject";

/**
 * Represents an action indicating that filter data has changed.
 * @interface
 */
interface IFilterDataChangedStateAction {
    /** The type of the action. */
    type: "filterdata-changed";
    /** The updated filter data. */
    filterData: Record<string, unknown>;
    /** A flag indicating whether pagination should be kept. */
    keepPagination: boolean;
}

/**
 * Represents an action indicating that rows have changed.
 * @interface
 */
interface IRowsChangedStateAction {
    /** The type of the action. */
    type: "rows-changed";
    /** The updated rows data. */
    rows: IRowData[];
    /** The total number of rows, or null if unknown. */
    total: number | null;
}

/**
 * Represents an action indicating that chips have changed.
 * @interface
 */
interface IChipsChangedStateAction {
    /** The type of the action. */
    type: "chips-changed";
    /** The updated chips data. */
    chips: ListHandlerChips;
}

/**
 * Represents an action indicating that search criteria have changed.
 * @interface
 */
interface ISearchChangedStateAction {
    /** The type of the action. */
    type: "search-changed";
    /** The updated search string. */
    search: string;
}

/**
 * Represents an action indicating that sorting criteria have changed.
 * @interface
 */
interface ISortChangedStateAction {
    /** The type of the action. */
    type: "sort-changed";
    /** The updated sort model. */
    sort: ListHandlerSortModel;
}

/**
 * Represents an action for submitting new list of rows to data grid.
 * @interface
 */
interface IRowsReloadStateAction {
    /** The type of action, indicating that rows have been changed. */
    type: "rows-reload";
    /** An array of row data representing the changes made to the rows. */
    rows: IRowData[];
}

/**
 * Represents a state action that can be dispatched to update the application state.
 */
export type IStateAction = IFilterDataChangedStateAction | IRowsChangedStateAction | IChipsChangedStateAction | ISearchChangedStateAction | ISortChangedStateAction | IRowsReloadStateAction;

export const [StateActionProvider, useStateAction] = createValueProvider<TSubject<IStateAction>>();

export default useStateAction;
