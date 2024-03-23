import IAnything from "../../../../model/IAnything";
import IField from "../../../../model/IField";

/**
 * Represents a filter list slot.
 *
 * @template FilterData - The type of filter data.
 */
export interface IFilterListSlot<FilterData extends {} = IAnything> {
    className?: string;
    filterData: FilterData;
    style?: React.CSSProperties;
    /**
     * Represents an array of field filters.
     *
     * @typedef {Array<IField<FilterData>>} FilterArray
     */
    filters: IField<FilterData>[];
    change: (data: FilterData) => void;
    /**
     * Represents a callback function for the onSearchChange event.
     *
     * @callback onSearchChangeCallback
     * @param {string} search - The search keyword entered by the user.
     * @returns {void}
     */
    onSearchChange?: (search: string) => void;
    /**
     * Function signature for the onFilterChange event callback.
     *
     * @param {FilterData} data - The data object representing the filter changes.
     * @returns {void}
     */
    onFilterChange?: (data: FilterData) => void;
    /**
     * Callback function called when the collapsed state changes.
     *
     * @param {boolean} collapsed - The new collapsed state.
     * @returns {void}
     */
    onCollapsedChange?: (collapsed: boolean) => void;
    /**
     * @description A flag indicating whether filters are toggled or not.
     * @type {boolean|undefined}
     */
    withToggledFilters?: boolean;
    ready: () => void;
    clean: () => void;
    loading: boolean;
    label: string;
    search: string;
    withSearch: boolean;
    height: number;
    width: number;
}
  
export default IFilterListSlot;
