import {
  Ref,
} from 'react';

import { SxProps } from '@mui/material';

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
import ITile from '../components/Tile/model/ITile';
import ISize from './ISize';

import { TSubject } from '../utils/rx/Subject';

import { ISlotFactoryContext } from '../components/List/components/SlotFactory';
import { IChipListSlot, TileMode } from '../components';

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
  /**
   * Check if a specific condition is satisfied for the visibility of an element.
   *
   * @param selectedRows - An array of selected rows.
   * @param payload - The payload object containing additional data.
   * @returns - A Promise resolving to a boolean value indicating the visibility, or a boolean value indicating the visibility of the element.
   */
  isVisible?: (selectedRows: RowData[], payload: Payload) => Promise<boolean> | boolean;
  /**
   * Checks whether the entity is disabled based on the provided selected rows and payload.
   *
   * @param selectedRows - The array of selected rows.
   * @param payload - The payload object containing additional data.
   * @returns - A promise or boolean indicating whether the entity is disabled.
   */
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
  /**
   * Determines the visibility of a certain element based on the provided parameters.
   *
   * @param selectedRows - An array of selected rows.
   * @param payload - The payload containing additional information.
   * @returns - A promise resolving to a boolean value indicating the visibility, or a boolean value indicating the visibility directly.
   */
  isVisible?: (selectedRows: RowData[], payload: Payload) => Promise<boolean> | boolean;
  /**
   * Checks if a row or a payload is disabled
   * @param selectedRows - The selected rows to check against
   * @param payload - The payload to check against
   * @returns - A promise that resolves with a boolean indicating if the row or the payload is disabled, or a boolean indicating if the row or the payload
   * is disabled
   */
  isDisabled?: (selectedRows: RowData[], payload: Payload) => Promise<boolean> | boolean;
  /**
   * Represents the icon component in React.
   *
   * @typedef IconType
   */
  icon?: React.ComponentType<any>;
  /**
   * @typedef IListActionOption<T>
   * @property rowData - The data of the row.
   *
   * @typedef IUpdateOption<T>
   * @property rowData - The data of the row.
   *
   * @typedef IResortOption<T>
   * @property rowData - The data of the row.
   *
   * @typedef IDropFiltersOption<T>
   * @property rowData - The data of the row.
   *
   * @typedef IAddFiltersOption<T>
   * @property rowData - The data of the row.
   *
   * @typedef Options
   *
   * @param options - An array of options.
   */
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
 * @typedef ListHandlerResult
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
 * @typedef ListAvatar
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
 * @typedef ListHandlerPagination
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
  isInfinite: boolean;
  isCustom: boolean;
  isPageItem: boolean;
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
  /**
   * Handles the list state reset.
   *
   * @function
   * @name handleDefault
   * @returns A promise that resolves with no value.
   */
  handleDefault: () => Promise<void>;
  /**
   * Handles the sort model for the given sort.
   *
   * @param sort - The sort model to handle.
   * @returns
   */
  handleSortModel: (sort: ListHandlerSortModel<RowData>) => void;
  /**
   * Handles the filter action.
   *
   * @param data - The filter data to be processed.
   * @param [keepPagination] - Indicates whether to keep the pagination state.
   *                                    Defaults to false.
   * @returns
   */
  handleFilter: (data: FilterData, keepPagination?: boolean) => void;
  /**
   * Handle page change function.
   *
   * @param page - The page number being handled.
   * @returns - There is no return value.
   */
  handlePageChange: (page: number) => void;
  /**
   * Handles a change in the limit value.
   *
   * @param limit - The new limit value.
   * @returns
   */
  handleLimitChange: (limit: number) => void;
  /**
   * Callback function to handle changes in rows.
   *
   * @param rows - An array of row data.
   * @returns - This function does not return anything.
   */
  handleRowsChange: (rows: RowData[]) => void;
  /**
   * Handles the event when the filters are collapsed or expanded.
   *
   * @param filtersCollapsed - Indicates whether the filters are collapsed or expanded.
   * @returns
   */
  handleFiltersCollapsed: (filtersCollapsed: boolean) => void;
  /**
   * Handles the chips list.
   *
   * @param chips - The list of chips to be handled.
   * @returns
   */
  handleChips: (chips: ListHandlerChips) => void;
  /**
   * Reloads the data and updates the UI.
   *
   * @param [keepPagination=false] - Determines whether to keep the current pagination state.
   *                                            If set to true, the pagination will not be reset after reloading.
   *                                            If not provided or set to false, the pagination will be reset to its initial state.
   * @returns - A promise that resolves once the data has been reloaded and the UI has been updated.
   */
  handleReload: (keepPagination?: boolean) => Promise<void>;
  /**
   * Handles the search action.
   *
   * @param search - The search query entered by the user.
   * @returns
   */
  handleSearch: (search: string) => void;
  /**
   * Function to handle re-rendering.
   *
   * @function
   * @name handleRerender
   * @returns
   */
  handleRerender: () => void;
  computeKeepPageOnReload: () => boolean;
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
  /**
   * Represents a React component that will be rendered after the chip list.
   */
  AfterChips?: React.ComponentType<IChipListSlot>;  
  /**
  * Represents a React component type for BeforeSelectionLabel.
  *
  * @template FilterData - The type of data used for filtering.
  * @template RowData - The type of data used for individual rows.
  * @template Payload - The type of payload for action.
  */
  BeforeSelectionLabel?: React.ComponentType<any>;
  /**
   * Represents a React component type for BeforeActionList.
   *
   * @template FilterData - The type of data used for filtering.
   * @template RowData - The type of data used for individual rows.
   * @template Payload - The type of payload for action.
   */
  BeforeActionList?: React.ComponentType<IPositionActionListSlot<FilterData, RowData, Payload>>;
  /**
   * Represents a React component for AfterActionList.
   *
   * @typeparam FilterData - The type of filter data.
   * @typeparam RowData - The type of row data.
   * @typeparam Payload - The type of payload.
   */
  AfterActionList?: React.ComponentType<IPositionActionListSlot<FilterData, RowData, Payload>>;
  /**
   * A React component that represents a list of position actions before an operation.
   *
   * @typedef BeforeOperationList
   * @template FilterData - The type of data used for filtering the list
   * @template RowData - The type of data used for each row in the list
   * @template Payload - The type of data sent as a payload during an operation
   *
   */
  BeforeOperationList?: React.ComponentType<IPositionActionListSlot<FilterData, RowData, Payload>>;
  /**
   * Represents the AfterOperationList component.
   *
   * This component is a React component that renders a list of actions to be displayed after a specific operation.
   * It is used to render the list of available actions, typically used for filtering or manipulating data.
   *
   * @template FilterData - The type of data used for filtering.
   * @template RowData - The type of data associated with each row.
   * @template Payload - The type of payload used for each action.
   *
   * @component
   */
  AfterOperationList?: React.ComponentType<IPositionActionListSlot<FilterData, RowData, Payload>>;
  /**
   * Represents a custom template component for rendering a tile.
   *
   * @typedef customTemplate
   * @property customTemplate - The custom template component used for rendering a tile.
   * @template {RowData} - The type of data for the tile row.
   * @template {Payload} - The type of payload associated with the tile.
   */
  customTemplate?: React.ComponentType<ITile<RowData, Payload>>;
  /**
   * Represents a custom template component for rendering a tile.
   *
   * @typedef pageItemTemplate
   * @property pageItemTemplate - The custom template component used for rendering a tile.
   * @template {RowData} - The type of data for the tile row.
   * @template {Payload} - The type of payload associated with the tile.
   */
  pageItemTemplate?: React.ComponentType<ITile<RowData, Payload>>;
  /**
   * Tiling mode for custom template
   */
  tileMode?: TileMode;
  /**
   * Represents the minimum height for a custom template.
   *
   * @type {number|undefined}
   */
  customTemplateMinHeight?: number;
  /**
   * Represents the minimum height for a page template.
   *
   * @type {number|undefined}
   */
  pageItemTemplateMinHeight?: number;
  /**
   * Represents the debounce time in milliseconds for performing fetch requests.
   */
  fetchDebounce?: number;
  className?: string;
  /**
   * Represents the height of an element, measured in pixels.
   *
   * @type {number}
   */
  denseHeight?: number;
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
  readTransform?: IOnePublicProps<FilterData>['readTransform'];
  writeTransform?: IOnePublicProps<FilterData>['writeTransform'];
  /**
   * Represents a function that calculates the desired height based on the provided input height.
   *
   * @param height - The input height value.
   * @return {number} - The calculated desired height.
   */
  heightRequest?: (height: number) => number;
  /**
   * Represents a function that takes a width value and returns a number.
   *
   * @param width - The width value to pass to the function.
   * @returns - The number value returned by the function.
   */
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
  rowMark?: ((row: RowData) => string) | ((row: RowData) => Promise<string>);
  rowColor?: ((row: RowData) => string) | ((row: RowData) => Promise<string>);
  /**
   * Custom sizeRequest for modal filters
   */
  modalSizeRequest?: (size: ISize) => {
    height: number;
    width: number;
    sx?: SxProps<any>;
  };
  /**
   * Determines if a row is disabled based on various parameters.
   *
   * @param row - The row data object.
   * @param params - The parameters used to determine row disablement.
   * @param params.filterData - The filter data object.
   * @param params.pagination - The pagination object.
   * @param params.sortModel - The sort model object.
   * @param params.chips - The chips object.
   * @param params.search - The search string.
   * @param params.payload - The payload object.
   * @returns - True if the row is disabled, false otherwise.
   */
  isRowDisabled?: (row: RowData, params: {
    filterData: FilterData,
    pagination: ListHandlerPagination,
    sortModel: ListHandlerSortModel<RowData>,
    chips: ListHandlerChips<RowData>,
    search: string,
    payload: Payload
  }) => boolean;
  /**
   * Returns a string containing information about the displayed rows label.
   *
   * @param paginationInfo - An object containing pagination information.
   * @param paginationInfo.from - The starting index of the displayed rows.
   * @param paginationInfo.to - The ending index of the displayed rows.
   * @param paginationInfo.count - The total count of rows.
   * @param paginationInfo.page - The current page.
   * @returns - The label displaying information about the displayed rows.
   */
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
  withHideIfEmpty?: boolean;
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
  isInfinite?: boolean;
  isCustom?: boolean;
  isPageItem?: boolean;
  isDense?: boolean;
  slots?: Partial<ISlotFactoryContext>;
}

export default IListProps;
