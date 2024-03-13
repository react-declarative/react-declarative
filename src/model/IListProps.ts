import {
  Ref,
} from 'react';

import ActionType from './ActionType';
import SelectionMode from './SelectionMode';

import IAnything from './IAnything';
import IRowData, { RowId } from './IRowData';
import IColumn from './IColumn';
import IListOperation from './IListOperation';
import IListRowAction from './IListRowAction';
import IField from './IField';
import IListApi from './IListApi';
import IOption from './IOption';
import IOnePublicProps from './IOnePublicProps';

import { TSubject } from '../utils/rx/Subject';

import { ISlotFactoryContext } from '../components/List/components/SlotFactory';

/**
 * An interface representing the update options for a list action.
 *
 * @typeparam RowData - The type of row data.
 *
 * @extends IListActionOption<RowData>
 */
interface IUpdateOption<RowData extends IRowData = IAnything> extends Omit<IListActionOption<RowData>, keyof {
  label: never;
  icon: never;
}> {
  action: 'update-now';
  label?: IOption['label'];
  icon?: IOption['icon'];
};

/**
 * Represents a resort option for a list action.
 * @interface
 * @template RowData - The type of row data for the resort option.
 * @extends {Omit<IListActionOption<RowData>, "label" | "icon">}
 */
interface IResortOption<RowData extends IRowData = IAnything> extends Omit<IListActionOption<RowData>, keyof {
  label: never;
  icon: never;
}> {
  action: 'resort-action';
  label?: IOption['label'];
  icon?: IOption['icon'];
}

/**
 * Represents the options for the "drop-filters" action in a list.
 *
 * @template RowData - The type of the row data.
 *
 * @interface IDropFiltersOption
 * @extends {Omit<IListActionOption<RowData>, 'label' | 'icon'>}
 */
interface IDropFiltersOption<RowData extends IRowData = IAnything> extends Omit<IListActionOption<RowData>, keyof {
  label: never;
  icon: never;
}> {
  action: 'drop-filters';
  label?: IOption['label'];
  icon?: IOption['icon'];
}

/**
 * Represents an option for adding filters.
 *
 * @template RowData - The type of the row data.
 */
interface IAddFiltersOption<RowData extends IRowData = IAnything> extends Omit<IListActionOption<RowData>, keyof {
  label: never;
  icon: never;
}> {
  action: 'add-action';
  label?: IOption['label'];
  icon?: IOption['icon'];
}

/**
 * Represents an option for a list action.
 *
 * @template RowData - The type of the row data.
 * @template Payload - The type of the payload.
 */
export interface IListActionOption<RowData extends IRowData = IAnything, Payload extends IAnything = IAnything> extends Omit<IOption, keyof {
  isVisible: never;
  isDisabled: never;
}> {
  isVisible?: (selectedRows: RowData[], payload: Payload) => Promise<boolean> | boolean;
  isDisabled?: (selectedRows: RowData[], payload: Payload) => Promise<boolean> | boolean;
};

/**
 * Represents an action that can be performed on a list of data.
 * @template RowData - The type of the row data.
 * @template Payload - The type of the payload.
 */
export interface IListAction<RowData extends IRowData = IAnything, Payload extends IAnything = IAnything> {
  type: ActionType;
  action?: string;
  label?: string;
  isVisible?: (selectedRows: RowData[], payload: Payload) => Promise<boolean> | boolean;
  isDisabled?: (selectedRows: RowData[], payload: Payload) => Promise<boolean> | boolean;
  icon?: React.ComponentType<any>;
  options?: (IListActionOption<RowData> | IUpdateOption<RowData> | IResortOption<RowData> | IDropFiltersOption<RowData> | IAddFiltersOption<RowData>)[];
}

/**
 * Represents a chip in a list.
 *
 * @template RowData - The type of the row data associated with the chip.
 */
export interface IListChip<RowData extends IRowData = IAnything> {
  name: keyof RowData,
  label: string;
  color?: string;
  enabled?: boolean;
}

/**
 * Represents the result of a list handling operation.
 *
 * @template RowData - The type of the row data.
 * @typedef {RowData[]} ListHandlerResult
 * @typedef {{
 *   rows: RowData[];
 *   total: number | null;
 * }} ListHandlerResult[]
 */
export type ListHandlerResult<RowData extends IRowData = IAnything> = RowData[] | {
  rows: RowData[];
  total: number | null;
};

/**
 * Represents the avatar for the list item.
 * @typedef {Object} ListAvatar
 * @property  [src] - The source URL for the avatar image.
 * @property  [alt] - The alternate text for the avatar image.
 */
export type ListAvatar = {
  src?: string;
  alt?: string;
};

/**
 * Represents a pagination handler for a list.
 *
 * @typedef {Object} ListHandlerPagination
 * @property  limit - The number of items to retrieve per page.
 * @property  offset - The starting index of the items to retrieve.
 */
export type ListHandlerPagination = {
  limit: number;
  offset: number;
};

/**
 * Represents a list handler for chips.
 * @template RowData - The type of row data.
 */
export type ListHandlerChips<RowData extends IRowData = IAnything> = Partial<Record<keyof RowData, boolean>>;

/**
 * Represents a sorting model for a list handler.
 *
 * @template RowData - The type of data in list rows.
 */
export type ListHandlerSortModel<RowData extends IRowData = IAnything> = IListSortItem<RowData>[];

/**
 * Represents a ListHandler class that handles filtering, pagination, sorting, and searching data.
 *
 * @param <FilterData> The type of data used for filtering.
 * @param <RowData> The type of data in each row.
 * @param <Payload> Optional payload data.
 */
export type ListHandler<FilterData extends {} = IAnything, RowData extends IRowData = IAnything, Payload = IAnything> = RowData[] | ((
  data: FilterData,
  pagination: ListHandlerPagination,
  sort: ListHandlerSortModel<RowData>,
  chips: ListHandlerChips<RowData>,
  search: string,
  payload: Payload,
) => Promise<ListHandlerResult<RowData>> | ListHandlerResult<RowData>);

/**
 * Represents the state of a list.
 *
 * @template FilterData - The type of the filter data.
 * @template RowData - The type of the row data.
 */
export interface IListState<FilterData extends {} = IAnything, RowData extends IRowData = IAnything> {
  initComplete: boolean;
  payload: IAnything;
  filterData: FilterData;
  isChooser: boolean;
  rows: RowData[];
  limit: number;
  offset: number;
  total: number | null;
  loading: boolean;
  search: string;
  filtersCollapsed: boolean;
  sort: ListHandlerSortModel<RowData>;
  chips: ListHandlerChips<RowData>;
  rerender: boolean;
};

/**
 * Interface contract for callback functions used in IList functionality.
 *
 * @template FilterData - The type of data to be used in filter operations.
 * @template RowData - The type of data contained in each row.
 */
export interface IListCallbacks<FilterData extends {} = IAnything, RowData extends IRowData = IAnything> {
  handleDefault: () => Promise<void>;
  handleSortModel: (sort: ListHandlerSortModel<RowData>) => void;
  handleFilter: (data: FilterData, keepPagination?: boolean) => void;
  handlePageChange: (page: number) => void;
  handleLimitChange: (limit: number) => void;
  handleRowsChange: (rows: RowData[]) => void;
  handleFiltersCollapsed: (filtersCollapsed: boolean) => void;
  handleChips: (chips: ListHandlerChips) => void;
  handleReload: (keepPagination?: boolean) => Promise<void>;
  handleSearch: (search: string) => void;
  handleRerender: () => void;
  ready: () => void;
};

/**
 * Represents a slot of position action in a list.
 * @interface
 * @template FilterData - The type of filter data.
 * @template RowData - The type of row data.
 * @template Payload - The type of payload.
 */
export interface IPositionActionListSlot<
  FilterData extends {} = IAnything,
  RowData extends IRowData = IAnything,
  Payload extends IAnything = IAnything
> extends Omit<IListCallbacks<FilterData, RowData>, 'ready'> {
  filterData: Record<string, any>;
  pagination: ListHandlerPagination;
  sortModel: ListHandlerSortModel<RowData>;
  chips: Record<string | number | symbol, boolean | undefined>;
  search: string;
  payload: Payload;
}

/**
 * Represents an item used for sorting in a list.
 * @template RowData - The type of the row data in the list.
 */
export interface IListSortItem<RowData extends IRowData = IAnything> {
  field: keyof RowData;
  sort: 'asc' | 'desc';
}

/**
 * Interface for the List datagrid component props.
 * @template FilterData The type of the filter data.
 * @template RowData The type of the row data.
 * @template Payload The type of the payload.
 * @template Field The type of the field.
 */
export interface IListProps<
  FilterData extends {} = IAnything,
  RowData extends IRowData = IAnything,
  Payload extends IAnything= IAnything,
  Field extends IField = IField<FilterData, Payload>,
> {
  apiRef?: Ref<IListApi<FilterData, RowData>>;
  BeforeActionList?: React.ComponentType<IPositionActionListSlot<FilterData, RowData, Payload>>;
  AfterActionList?: React.ComponentType<IPositionActionListSlot<FilterData, RowData, Payload>>;
  BeforeOperationList?: React.ComponentType<IPositionActionListSlot<FilterData, RowData, Payload>>;
  AfterOperationList?: React.ComponentType<IPositionActionListSlot<FilterData, RowData, Payload>>;
  fetchDebounce?: number;
  className?: string;
  style?: React.CSSProperties;
  title?: string;
  withRawSearch?: boolean;
  filterLabel?: string;
  actions?: IListAction<RowData, Payload>[];
  operations?: IListOperation<RowData, Payload>[];
  limit?: number;
  page?: number;
  sizeByElement?: boolean;
  selectedRows?: RowId[];
  features?: IOnePublicProps<FilterData>['features'];
  heightRequest?: (height: number) => number;
  widthRequest?: (width: number) => number;
  onRows?: (rows: RowData[]) => void;
  onSelectedRows?: (rowIds: RowId[], initialChange: boolean) => void;
  onFilterChange?: (data: FilterData) => void;
  onChipsChange?: (data: ListHandlerChips<RowData>) => void;
  onSearchChange?: (search: string) => void;
  onSortModelChange?: (sort: ListHandlerSortModel<RowData>) => void;
  onOperation?: (action: string, selectedRows: RowData[], isAll: boolean, reload: (keepPagination?: boolean) => Promise<void>) => void;
  onRowAction?: (action: string, row: RowData, reload: (keepPagination?: boolean) => Promise<void>) => void;
  onRowClick?: (row: RowData,  reload: (keepPagination?: boolean) => Promise<void>) => void;
  onPageChange?: (page: number) => void;
  onColumnAction?: (field: string, action: string, selectedRows: RowData[], reload: (keepPagination?: boolean) => Promise<void>) => void;
  onLimitChange?: (limit: number) => void;
  onLoadStart?: (source: string) => void;
  onLoadEnd?: (isOk: boolean, source: string) => void;
  onAction?: (action: string, selectedRows: RowData[], reload: (keepPagination?: boolean) => Promise<void>) => void;
  columns: IColumn<FilterData, RowData, Payload>[];
  filters?: Field[];
  handler: ListHandler<FilterData, RowData>;
  payload?: Payload | (() => Payload);
  rowMark?: ((row: RowData) => string) | ((row: RowData) => Promise<string>) | string;
  rowColor?: ((row: RowData) => string);
  isRowDisabled?: (row: RowData, params: {
    filterData: FilterData,
    pagination: ListHandlerPagination,
    sortModel: ListHandlerSortModel<RowData>,
    chips: ListHandlerChips<RowData>,
    search: string,
    payload: Payload
  }) => boolean;
  labelDisplayedRows?: (paginationInfo: {
    from: number;
    to: number;
    count: number;
    page: number;
  }) => string;
  fallback?: (e: Error) => void;
  reloadSubject?: TSubject<void>;
  rerenderSubject?: TSubject<void>;
  setLimitSubject?: TSubject<number>;
  setPageSubject?: TSubject<number>;
  setRowsSubject?: TSubject<RowData[]>;
  setFilterDataSubject?: TSubject<FilterData>;
  rowActions?: IListRowAction[];
  noDisplayedRows?: boolean;
  withCustomFilters?: boolean;
  withOutlinePaper?: boolean;
  withTransparentPaper?: boolean;
  withSingleChip?: boolean;
  withAllListOperations?: boolean;
  withSelectOnRowClick?: boolean;
  withToggledFilters?: boolean;
  withSingleSort?: boolean;
  withSearch?: boolean;
  withLoader?: boolean;
  withMobile?: boolean;
  withArrowPagination?: boolean;
  withRangePagination?: boolean;
  withInitialLoader?: boolean;
  selectionLabel?: (size: number) => string | Promise<string>;
  rowsPerPage?: Array<number | { value: number; label: string }>;
  selectionMode?: SelectionMode;
  chips?: IListChip<RowData>[];
  chipData?: ListHandlerChips<RowData>;
  search?: string;
  filterData?: Partial<FilterData>;
  sortModel?: ListHandlerSortModel<RowData>;
  isChooser?: boolean;
  slots?: Partial<ISlotFactoryContext>;
}

export default IListProps;
