import * as React from "react";
import { flushSync } from "react-dom";

import { ThemeProvider } from "../../../../styles";

import { debounce } from "@mui/material";

import IListProps, {
  IListCallbacks,
  IListState,
  ListHandlerChips,
  ListHandlerResult,
  ListHandlerSortModel,
} from "../../../../model/IListProps";
import IAnything from "../../../../model/IAnything";
import IRowData from "../../../../model/IRowData";
import IField from "../../../../model/IField";
import IListApi from "../../../../model/IListApi";

import initialValue from "../../../One/config/initialValue";

import NoSsr from "../../../NoSsr";

import deepMerge from "../../../../utils/deepMerge";
import deepFlat from "../../../../utils/deepFlat";
import sleep from "../../../../utils/sleep";
import set from "../../../../utils/set";;
import get from "../../../../utils/get";
import create from "../../../../utils/create";

import GridView from "../view/GridView";
import ChooserView from "../view/ChooserView";
import InfiniteView from "../view/InfiniteView";

import { ConstraintManagerProvider } from "../../hooks/useConstraintManager";
import { ScrollManagerProvider } from "../../hooks/useScrollManager";
import { SelectionProvider } from "../../hooks/useSelection";
import { SortModelProvider } from "../../hooks/useSortModel";
import { ModalSortProvider } from "../../hooks/useModalSort";
import { CachedRowsProvider } from "../../hooks/useCachedRows";
import { PayloadProvider } from "../../hooks/usePayload";
import { ChipsProvider } from "../../hooks/useChips";
import { PropProvider } from "../../hooks/useProps";

import { DEFAULT_LIMIT, DEFAULT_PAGE, LIST_FETCH_DEBOUNCE } from "../../config";

import createScrollManager from "../../helpers/createScrollManager";
import createConstraintManager from "../../helpers/createConstraintManager";
import ignoreSymbols from "../../helpers/ignoreSymbols";

import { TileMode } from "../../../Tile";

import { RowDisabledMapProvider } from "../../hooks/useRowDisabledMap";
import { IStateAction, StateActionProvider } from "../../hooks/useStateAction";
import { FilterDataProvider } from "../../hooks/useFilterData";
import { PaginationProvider } from "../../hooks/usePagination";
import { SearchProvider } from "../../hooks/useSearch";

import Subject from "../../../../utils/rx/Subject";

import SlotFactory from "../SlotFactory";
import CustomView from "../view/CustomView";

export class Entry<
  FilterData extends {} = IAnything,
  RowData extends IRowData = IAnything,
  Payload extends IAnything = IAnything,
  Field extends IField = IField<FilterData, Payload>
> extends React.Component<
  IListProps<FilterData, RowData, Payload, Field>,
  IListState<FilterData, RowData>
> {

  private readonly stateActionEmitter = new Subject<IStateAction>();

  private isMountedFlag = false;
  private isFetchingFlag = false;
  private isRerenderFlag = false;
  private isPatchingFlag = false;

  private prevState: Partial<IListState> = {};

  private scrollManager = createScrollManager();
  private constraintManager = createConstraintManager();

  private unReloadSubject?: () => void;
  private unRerenderSubject?: () => void;
  private unSetLimitSubject?: () => void;
  private unSetPageSubject?: () => void;
  private unSetRowsSubject?: () => void;
  private unSetFilterDataSubject?: () => void;

  /**
   * Default props for the `defaultProps` variable.
   *
   * @type {Partial<IListProps>}
   * @property handler - The default handler function that returns an empty array.
   * @property payload - The default payload object.
   * @property fallback - The default fallback function that logs an error to the console.
   * @property limit - The default limit value.
   * @property page - The default page value.
   * @property isChooser - The default isChooser value.
   * @property isInfinite - The default isInfinite value.
   * @property isCustom - The default isCustom value.
   * @property filters - The default filters array.
   * @property columns - The default columns array.
   * @property actions - The default actions array.
   * @property onRows - The default onRows function that returns null.
   * @property onSortModelChange - The default onSortModelChange function that returns null.
   * @property onFilterChange - The default onFilterChange function that returns null.
   * @property onChipsChange - The default onChipsChange function that returns null.
   * @property onSearchChange - The default onSearchChange function that returns null.
   * @property onPageChange - The default onPageChange function that returns null.
   * @property onLimitChange - The default onLimitChange function that returns null.
   * @property labelDisplayedRows - The default labelDisplayedRows function.
   * @property selectionLabel - The default selectionLabel function.
   * @property filterData - The default filterData object.
   * @property withToggledFilters - The default withToggledFilters value.
   * @property withCustomFilters - The default withCustomFilters value.
   * @property fetchDebounce - The default fetchDebounce value.
   * @property sortModel - The default sortModel array.
   * @property chips - The default chips array.
   * @property chipData - The default chipData object.
   * @property search - The default search value.
   * @property slots - The default slots object.
   */
  static defaultProps: Partial<IListProps> = {
    handler: () => [],
    payload: {},
    fallback: (e) => console.error(e),
    limit: DEFAULT_LIMIT,
    page: DEFAULT_PAGE,
    isChooser: false,
    isInfinite: false,
    isCustom: false,
    filters: [],
    columns: [],
    actions: [],
    onRows: () => null,
    onSortModelChange: () => null,
    onFilterChange: () => null,
    onChipsChange: () => null,
    onSearchChange: () => null,
    onPageChange: () => null,
    onLimitChange: () => null,
    labelDisplayedRows: ({ count, from, to }) => `${from}–${to} ${count !== -1 ? `(${count})` : ''}`,
    selectionLabel: (size) => `${size || ''}`,
    filterData: {},
    withToggledFilters: false,
    withCustomFilters: false,
    fetchDebounce: LIST_FETCH_DEBOUNCE,
    tileMode: TileMode.Intersection,
    sortModel: [],
    chips: [],
    chipData: {},
    search: "",
    slots: {},
  };

  /**
   * Initializes a new instance of the constructor.
   *
   * @param props - The props to be passed to the constructor.
   * @param props.filterData - The filter data.
   * @param props.rowData - The row data.
   * @param props.payload - The payload.
   * @param props.field - The field.
   * @returns
   */
  constructor(props: IListProps<FilterData, RowData, Payload, Field>) {
    super(props);

    const getOffset = () => {
      if (this.props.isChooser) {
        return 0;
      }
      if (this.props.isInfinite) {
        return 0;
      }
      if (this.props.isCustom) {
        return 0;
      }
      return this.props.limit! * this.props.page!
    }

    this.state = {
      initComplete: false,
      payload:
        typeof this.props.payload === "function"
          ? (this.props.payload as Function)()
          : this.props.payload,
      isChooser: this.props.isChooser!,
      isInfinite: this.props.isInfinite!,
      isCustom: !!this.props.customTemplate || this.props.isCustom!,
      filterData: this.props.filterData as never,
      rows: [] as never,
      limit: this.props.limit!,
      offset: getOffset(),
      total: null,
      search: this.props.search || "",
      loading: false,
      filtersCollapsed: this.props.withToggledFilters!,
      sort: this.props.sortModel!,
      chips: this.props.chips!.reduce<ListHandlerChips<RowData>>(
        (acm, { name: chip, enabled = false }) => ({
          ...acm,
          [chip]: this.props.chipData![chip] || enabled,
        }),
        {} as any
      ),
      rerender: false,
    };
    this.prevState = { ...this.state };
    this.handleFetchQueue = this.createHandleFetchQueue(props.fetchDebounce);
  }

  /**
   * Sets the loading state of the component.
   *
   * @param loading - A boolean value indicating the loading state.
   */
  private setLoading = (loading: boolean) =>
    this.isMountedFlag &&
    this.setState((prevState) => ({ ...prevState, loading }));
  
  /**
   * Sets the value of `filtersCollapsed` state property.
   *
   * @param filtersCollapsed - The new value for `filtersCollapsed` state property.
   * @returns
   */
  private setFiltersCollapsed = (filtersCollapsed: boolean) =>
    this.isMountedFlag &&
    this.setState((prevState) => ({ ...prevState, filtersCollapsed }));

  /**
   * Handles the component's componentDidUpdate lifecycle method.
   * - Calls the handleUpdateRef method.
   * - Checks if rerender state is true. If true, calls the beginRerender method.
   * - If rerender state is false, calls the beginFetchQueue method.
   *
   * @memberOf Component
   * @function
   * @name componentDidUpdate
   * @returns
   */
  public componentDidUpdate = () => {
    this.handleUpdateRef();
    if (this.state.rerender) {
      this.beginRerender();
    } else {
      this.beginFetchQueue();
    }
  };

  /**
   * Component lifecycle method invoked immediately after a component is mounted.
   *
   * Sets the 'isMountedFlag' to true. Calls 'handleEmptyFilters()' and 'handleUpdateRef()'
   * methods to handle empty filters and update references, respectively.
   *
   * @function componentDidMount
   * @returns
   */
  public componentDidMount = () => {
    this.isMountedFlag = true;
    this.handleEmptyFilters();
    this.handleUpdateRef();
  };

  /**
   * Method called before the component is unmounted.
   * It is responsible for cleaning up any side effects or subscriptions before the component is removed from the DOM.
   * @memberOf Component
   *
   * @returns
   */
  public componentWillUnmount = () => {
    this.isFetchingFlag = false;
    this.isMountedFlag = false;
    this.handleFetchQueue.clear();
    this.unReloadSubject && this.unReloadSubject();
    this.unRerenderSubject && this.unRerenderSubject();
    this.unSetLimitSubject && this.unSetLimitSubject();
    this.unSetPageSubject && this.unSetPageSubject();
    this.unSetRowsSubject && this.unSetRowsSubject();
  };

  /**
   * Function to begin rerendering the component.
   *
   * It queues the rerendering task as a microtask,
   * flushes any synchronous updates, and updates the state
   * to disable further rerenders if the component is still mounted.
   * It also sets a flag to indicate that a rerender is requested.
   */
  private beginRerender = () => {
    queueMicrotask(() =>
      flushSync(() => {
        this.isMountedFlag &&
          this.setState((prevState) => ({
            ...prevState,
            rerender: false,
          }));
        this.isRerenderFlag = true;
      })
    );
  };

  /**
   * Begins fetching the queue based on the state of filtersCollapsed.
   * If filtersCollapsed has not changed, calls handleFetchQueue.
   * Otherwise, updates prevState.filtersCollapsed.
   */
  private beginFetchQueue = () => {
    if (this.prevState.filtersCollapsed === this.state.filtersCollapsed) {
      this.handleFetchQueue();
    } else {
      this.prevState.filtersCollapsed = this.state.filtersCollapsed;
    }
  };

  /**
   * Debounces the execution of a function that handles fetching data,
   * ensuring that it is called only after a certain delay has passed.
   *
   * @param [delay=LIST_FETCH_DEBOUNCE] - The delay in milliseconds before
   *     executing the function.
   * @returns - The debounced function.
   */
  private createHandleFetchQueue = (delay = LIST_FETCH_DEBOUNCE) =>
    debounce(() => {
      const updateQueue = [this.handlePageChanged, this.handleParamsChanged];
      let isOk = true;
      isOk = isOk && !this.state.loading;
      isOk = isOk && this.state.initComplete;
      if (isOk) {
        if (!this.isFetchingFlag) {
          return;
        } else if (this.isRerenderFlag) {
          this.isRerenderFlag = false;
        } else if (this.isPatchingFlag) {
          this.isPatchingFlag = false;
        } else {
          this.isFetchingFlag = false;
          updateQueue.reduce((acm, cur) => {
            if (acm) {
              return !cur();
            }
            return acm;
          }, true);
        }
      }
      this.prevState = { ...this.state };
    }, delay);

  /**
   * Creates a handle for the fetch queue.
   *
   * @returns The handle object for the fetch queue.
   */
  private handleFetchQueue = this.createHandleFetchQueue();

  /**
   * Handles the page change event.
   * Determines if the page change is valid and triggers a reload if necessary.
   * @returns - True if the page change is valid, otherwise false.
   */
  private handlePageChanged = () => {
    let isOk = false;
    isOk = isOk || this.prevState.offset === this.state.offset;
    isOk = isOk || this.prevState.limit === this.state.limit;
    if (isOk) {
      this.handleReload();
    }
    return isOk;
  };

  /**
   * Handle method to check if any params have changed.
   * @returns Returns true if any of the parameters have changed, false otherwise.
   */
  private handleParamsChanged = () => {
    let isOk = false;
    isOk = isOk || this.prevState.chips === this.state.chips;
    isOk = isOk || this.prevState.sort === this.state.sort;
    isOk = isOk || this.prevState.search === this.state.search;
    if (isOk) {
      this.handleFilter(this.state.filterData, false);
      this.props.onPageChange!(0);
    }
    return isOk;
  };

  /**
   * Updates the reference to the API instance for the current component.
   * It sets up event subscriptions for various API actions.
   *
   * @function handleUpdateRef
   */
  private handleUpdateRef = () => {
    const { apiRef } = this.props;
    const instance: IListApi<FilterData, RowData> = {
      reload: this.handleReload,
      setLimit: this.handleLimitChange,
      setPage: this.handlePageChange,
      setRows: this.handleRowsChange,
      setFilterData: this.handleFilter,
      getState: () => ({ ...this.state }),
      rerender: this.handleRerender,
    };
    if (typeof apiRef === "function") {
      apiRef(instance);
    } else if (apiRef) {
      (apiRef.current as any) = instance;
    }
    if (this.props.reloadSubject) {
      this.unReloadSubject && this.unReloadSubject();
      this.unReloadSubject = this.props.reloadSubject.subscribe(
        this.handleReload as () => void
      );
    }
    if (this.props.rerenderSubject) {
      this.unRerenderSubject && this.unRerenderSubject();
      this.unRerenderSubject = this.props.rerenderSubject.subscribe(
        this.handleRerender
      );
    }
    if (this.props.setLimitSubject) {
      this.unSetLimitSubject && this.unSetLimitSubject();
      this.unSetLimitSubject = this.props.setLimitSubject.subscribe(
        this.handleLimitChange
      );
    }
    if (this.props.setPageSubject) {
      this.unSetPageSubject && this.unSetPageSubject();
      this.unSetPageSubject = this.props.setPageSubject.subscribe(
        this.handlePageChange
      );
    }
    if (this.props.setRowsSubject) {
      this.unSetRowsSubject && this.unSetRowsSubject();
      this.unSetRowsSubject = this.props.setRowsSubject.subscribe(
        this.handleRowsChange
      );
    }
    if (this.props.setFilterDataSubject) {
      this.unSetFilterDataSubject && this.unSetFilterDataSubject();
      this.unSetFilterDataSubject = this.props.setFilterDataSubject.subscribe(
        this.handleFilter
      );
    }
  };

  /**
   * Handles empty filters by checking if filters exist and if they are custom filters
   *
   * @function handleEmptyFilters
   */
  private handleEmptyFilters = () => {
    let hasFilters = true;
    hasFilters = hasFilters && Array.isArray(this.props.filters);
    hasFilters = hasFilters && !!this.props.filters?.length;
    hasFilters = hasFilters && !this.props.withCustomFilters;
    if (!hasFilters) {
      this.handleDefault(true);
    }
    this.prevState.filtersCollapsed = this.state.filtersCollapsed;
  };

  /**
   * Handles rows of data based on the given filter data.
   *
   * @param filterData - The filter data to apply.
   * @param [keepPagination=false] - Whether to keep the current pagination or reset it.
   * @returns
   * 
   * 
   *  The resulting rows and total count.
   */
  private handleRows = async (
    filterData: FilterData,
    keepPagination = false
  ): Promise<{
    rows: RowData[];
    total: number | null;
  }> => {
    /** react-18 prevent batching */
    await sleep(0);
    if (typeof this.props.handler === "function") {
      const response: ListHandlerResult<RowData> = await Promise.resolve(
        this.props.handler(
          filterData,
          {
            limit: this.state.limit,
            offset: keepPagination ? this.state.offset : 0,
          },
          this.state.sort,
          this.state.chips,
          String(this.props.withRawSearch ? this.state.search : ignoreSymbols(this.state.search)).trim(),
          this.state.payload
        )
      );
      if (Array.isArray(response)) {
        response.length > this.state.limit &&
          console.warn("List rows count is more than it's capacity");
        const result = {
          rows: response.slice(0, this.state.limit),
          total: null,
        };
        this.props.onRows!(result.rows);
        return result;
      } else {
        const { rows = [], total = null } = response || {};
        rows.length > this.state.limit &&
          console.warn("List rows count is more than it's capacity");
        const result = { rows: rows.slice(0, this.state.limit), total };
        this.props.onRows!(result.rows);
        return result;
      }
    } else {
      if (Array.isArray(this.props.handler)) {
        const result = {
          rows: this.props.handler.slice(
            this.state.offset,
            this.state.limit + this.state.offset
          ),
          total: this.props.handler.length,
        };
        this.props.onRows!(result.rows);
        return result;
      } else {
        const { rows = [], total = null } = this.props.handler || {};
        const result = {
          rows: rows.slice(
            this.state.offset,
            this.state.limit + this.state.offset
          ),
          total,
        };
        this.props.onRows!(result.rows);
        return result;
      }
    }
  };

  /**
   * Handle filter function
   *
   * @async
   * @param filterData - The filter data to be applied
   * @param [keepPagination=false] - Flag to indicate whether to keep the current pagination or not
   * @returns
   */
  private handleFilter = async (
    filterData: FilterData,
    keepPagination = false
  ) => {
    if (this.state.loading) {
      return;
    }
    this.setLoading(true);
    try {
      await this.stateActionEmitter.next({
        type: "filterdata-changed",
        keepPagination,
        filterData,
      })
      const { rows, total } = await this.handleRows(filterData, keepPagination);
      await this.stateActionEmitter.next({
        type: "rows-changed",
        rows,
        total,
      });
      if (!keepPagination) {
        this.scrollManager.scrollTop();
      }
      this.isMountedFlag &&
        this.setState((prevState) => ({
          ...prevState,
          initComplete: true,
          loading: false,
          filterData,
          rows,
          total,
          ...(!keepPagination && {
            offset: 0,
          }),
        }));
    } catch (e) {
      this.props.fallback!(e as Error);
    } finally {
      this.setLoading(false);
      this.props.onFilterChange!(filterData);
    }
  };

  /**
   * Asynchronously handles default values for filters.
   *
   * @param initialCall - Indicates if this is the initial call.
   * @returns - A promise that resolves when the default handling is complete.
   */
  private handleDefault = async (initialCall = false) => {
    const newData: Partial<FilterData> = {};
    deepFlat(this.props.filters)
      .filter(({ name }) => !!name)
      .forEach(({ type, name, defaultValue, hidden }) => {
        create(newData, name);
        if (typeof hidden === 'function' ? hidden(this.state.payload) : hidden) {
          return;
        } else if (typeof defaultValue === 'undefined') {
          set(newData, name, get(newData, name) || initialValue(type));
        } else if (typeof defaultValue === 'function') {
          set(newData, name, (defaultValue as Function)(this.state.payload));
        } else {
          set(newData, name, defaultValue);
        }
      });
    if (initialCall) {
      deepMerge(newData, this.props.filterData!);
    }
    await this.handleFilter(newData as FilterData, initialCall);
    !initialCall && this.props.onPageChange!(0);
  };

  /**
   * Reloads the data by clearing constraints and scroll manager, and applying filters.
   * Optionally updates the page number to 0.
   *
   * @param [keepPagination=true] - Flag to specify whether to update the page number.
   * @returns - Promise that resolves when the reload process is complete.
   */
  private handleReload = async (keepPagination = true) => {
    this.constraintManager.constraintManager.clear();
    this.scrollManager.clear();
    await this.handleFilter(this.state.filterData, keepPagination);
    !keepPagination && this.props.onPageChange!(0);
  };

  /**
   * Function to handle page change.
   *
   * @param page - The new page number.
   */
  private handlePageChange = (page: number) => {
    this.isFetchingFlag = true;
    this.isMountedFlag &&
      this.setState((prevState) => ({
        ...prevState,
        offset: page * prevState.limit,
      }));
    this.props.onPageChange!(page);
  };

  /**
   * Handles a change in the limit
   *
   * @param newLimit - The new limit value
   * @returns
   */
  private handleLimitChange = (newLimit: number) => {
    this.isFetchingFlag = true;
    const newPage = Math.floor(this.state.offset / newLimit);
    this.isMountedFlag &&
      this.setState((prevState) => ({
        ...prevState,
        offset: newPage * newLimit,
        limit: newLimit,
      }));
    this.props.onLimitChange!(newLimit);
  };

  /**
   * Updates the state with new rows.
   *
   * @param rows - Array of row data to be updated.
   * @return
   */
  private handleRowsChange = (rows: RowData[]) => {
    this.isPatchingFlag = true;
    this.isMountedFlag &&
      this.setState((prevState) => ({
        ...prevState,
        rows: rows.slice(0, prevState.limit).map((row) => ({ ...row })),
      }));
  };

  /**
   * Updates the sort model and triggers related actions.
   *
   * @param sort - The new sort model.
   */
  private handleSortModel = async (sort: ListHandlerSortModel) => {
    await this.stateActionEmitter.next({
      type: "sort-changed",
      sort,
    });
    this.isFetchingFlag = true;
    this.isMountedFlag &&
      this.setState((prevState) => ({
        ...prevState,
        offset: 0,
        sort,
      }));
    this.props.onSortModelChange!(sort);
    this.props.onPageChange!(0);
  };

  /**
   * Updates the chips and triggers necessary actions when the chips are handled.
   *
   * @param chips - The list of chips to be handled.
   * @returns
   */
  private handleChips = async (chips: ListHandlerChips) => {
    await this.stateActionEmitter.next({
      type: "chips-changed",
      chips,
    });
    this.isFetchingFlag = true;
    this.isMountedFlag &&
      this.setState((prevState) => ({
        ...prevState,
        offset: 0,
        chips,
      }));
    this.props.onChipsChange!({ ...this.state.chips, ...chips });
    this.props.onPageChange!(0);
  };

  /**
   * Handles the search functionality.
   *
   * @param search - The search string.
   *
   * @returns
   */
  private handleSearch = async (search: string) => {
    await this.stateActionEmitter.next({
      type: "search-changed",
      search,
    });
    this.isFetchingFlag = true;
    this.isMountedFlag &&
      this.setState((prevState) => ({
        ...prevState,
        offset: 0,
        search,
      }));
    this.props.onSearchChange!(search);
    this.props.onPageChange!(0);
  };

  /**
   * Function to handle rerendering of component.
   * It uses `queueMicrotask()` and `flushSync()` to ensure synchronous updates.
   * If the component is currently mounted, it updates the state to trigger a rerender.
   *
   * @function handleRerender
   * @returns
   */
  private handleRerender = () => {
    queueMicrotask(() =>
      flushSync(() => {
        this.isMountedFlag &&
          this.setState((prevState) => ({
            ...prevState,
            rerender: true,
          }));
      })
    );
  };

  /**
   * Sets the state of filtersCollapsed and calls the setFiltersCollapsed method.
   *
   * @param filtersCollapsed - The new value for filtersCollapsed.
   *
   * @returns
   */
  private handleFiltersCollapsed = (filtersCollapsed: boolean) =>
    this.setFiltersCollapsed(filtersCollapsed);

  /**
   * Returns a collection of callback functions.
   *
   * @return - The collection of callback functions.
   */
  private getCallbacks = (): IListCallbacks => ({
    handlePageChange: this.handlePageChange,
    handleLimitChange: this.handleLimitChange,
    handleSortModel: this.handleSortModel,
    handleDefault: this.handleDefault,
    handleFilter: this.handleFilter,
    handleReload: this.handleReload,
    handleChips: this.handleChips,
    handleSearch: this.handleSearch,
    handleRowsChange: this.handleRowsChange,
    handleFiltersCollapsed: this.handleFiltersCollapsed,
    handleRerender: this.handleRerender,
    ready: () => {
      if (!this.props.withCustomFilters) {
        this.handleDefault(true);
      }
    },
  });

  /**
   * Renders the inner component based on the current props and state values.
   *
   * @returns The rendered JSX element.
   */
  public renderInner = () => {
    const callbacks = this.getCallbacks();
    if (this.props.isCustom) {
      return (
        <CustomView<FilterData, RowData>
          {...this.props}
          {...this.state}
          handler={this.props.handler}
          filters={this.props.filters}
          columns={this.props.columns}
          actions={this.props.actions}
          limit={this.state.limit}
          offset={this.state.offset}
          listChips={this.props.chips}
          {...callbacks}
        />
      );
    } else if (this.props.isInfinite) {
      return (
        <InfiniteView<FilterData, RowData>
          {...this.props}
          {...this.state}
          handler={this.props.handler}
          filters={this.props.filters}
          columns={this.props.columns}
          actions={this.props.actions}
          limit={this.state.limit}
          offset={this.state.offset}
          listChips={this.props.chips}
          {...callbacks}
        />
      );
    } else if (this.props.isChooser) {
      return (
        <ChooserView<FilterData, RowData>
          {...this.props}
          {...this.state}
          handler={this.props.handler}
          filters={this.props.filters}
          columns={this.props.columns}
          actions={this.props.actions}
          limit={this.state.limit}
          offset={this.state.offset}
          listChips={this.props.chips}
          {...callbacks}
        />
      );
    } else {
      return (
        <GridView<FilterData, RowData>
          {...this.props}
          {...this.state}
          handler={this.props.handler}
          filters={this.props.filters}
          columns={this.props.columns}
          actions={this.props.actions}
          limit={this.state.limit}
          offset={this.state.offset}
          listChips={this.props.chips}
          {...callbacks}
        />
      );
    }
  };

  /**
   * Renders the component with nested providers and props
   *
   * @returns The rendered component
   */
  public render = () => {
    const callbacks = this.getCallbacks();
    return (
      <NoSsr>
        <ThemeProvider>
          <StateActionProvider payload={this.stateActionEmitter}>
            <PropProvider {...{ ...this.props, ...this.state, ...callbacks }}>
              <ScrollManagerProvider payload={this.scrollManager}>
                <ConstraintManagerProvider payload={this.constraintManager}>
                  <SelectionProvider selectedRows={this.props.selectedRows}>
                    <CachedRowsProvider>
                      <RowDisabledMapProvider initialState={() => new Map()}>
                        <SortModelProvider sortModel={this.props.sortModel!}>
                          <ChipsProvider
                            chips={this.props.chips!}
                            chipData={this.props.chipData!}
                          >
                            <FilterDataProvider value={this.state.filterData}>
                              <PaginationProvider
                                limit={this.state.limit}
                                offset={this.state.offset}
                              >
                                <SearchProvider value={this.state.search}>
                                  <ModalSortProvider>
                                    <SlotFactory {...this.props.slots}>
                                      <PayloadProvider value={this.state.payload}>
                                        {this.renderInner()}
                                      </PayloadProvider>
                                    </SlotFactory>
                                  </ModalSortProvider>
                                </SearchProvider>
                              </PaginationProvider>
                            </FilterDataProvider>
                          </ChipsProvider>
                        </SortModelProvider>
                      </RowDisabledMapProvider>
                    </CachedRowsProvider>
                  </SelectionProvider>
                </ConstraintManagerProvider>
              </ScrollManagerProvider>
            </PropProvider>
          </StateActionProvider>
        </ThemeProvider>
      </NoSsr>
    );
  };
}

export default Entry;
