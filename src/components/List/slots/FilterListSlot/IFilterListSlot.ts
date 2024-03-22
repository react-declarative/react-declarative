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
    filters: IField<FilterData>[];
    change: (data: FilterData) => void;
    onSearchChange?: (search: string) => void;
    onFilterChange?: (data: FilterData) => void;
    onCollapsedChange?: (collapsed: boolean) => void;
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
