import * as React from 'react';

import { ThemeProvider } from '../../styles';

import { debounce } from '@mui/material';

import IListProps, { IListCallbacks, IListState, ListHandlerChips, ListHandlerResult, ListHandlerSortModel } from '../../model/IListProps';
import TypedField from '../../model/TypedField';
import IAnything from '../../model/IAnything';
import IRowData from '../../model/IRowData';
import IField from '../../model/IField';
import IListApi from '../../model/IListApi';

import initialValue from '../One/config/initialValue';
import deepFlat from '../../utils/deepFlat';
import set from '../../utils/set';

import GridView from './components/view/GridView';
import ChooserView from './components/view/ChooserView';

import { SelectionProvider } from './hooks/useSelection';
import { SortModelProvider } from './hooks/useSortModel';
import { ModalSortProvider } from './hooks/useModalSort';
import { CachedRowsProvider } from './hooks/useCachedRows';
import { ChipsProvider } from './hooks/useChips';
import { PropProvider } from './hooks/useProps';

import scrollManager from './helpers/scrollManager';

const DEFAULT_PAGE = 0;
const DEFAULT_LIMIT = 10;
const LIST_FETCH_DEBOUNCE = 1_000;

export class List<
    FilterData extends IAnything = IAnything,
    RowData extends IRowData = IAnything,
    Field extends IField = IField<IAnything>,
> extends React.Component<IListProps<FilterData, RowData, Field>, IListState> {

    private isMountedFlag = false;
    private isFetchingFlag = false;

    private prevState: Partial<IListState> = {};

    static defaultProps: Partial<IListProps> = {
        handler: () => [],
        fallback: (e) => console.error(e),
        limit: DEFAULT_LIMIT,
        page: DEFAULT_PAGE,
        isChooser: false,
        filters: [],
        columns: [],
        actions: [],
        onSortModelChange: () => null,
        onFilterChange: () => null,
        onChipsChange: () => null,
        onSearchChange: () => null,
        onPageChange: () => null,
        onLimitChange: () => null,
        toggleFilters: false,
        sortModel: [],
        chips: [],
    };

    constructor(props: IListProps<FilterData, RowData, Field>) {
        super(props);
        this.state = {
            initComplete: false,
            isChooser: this.props.isChooser!,
            filterData: {} as never,
            rows: [] as never,
            limit: this.props.limit!,
            offset: this.props.limit! * this.props.page!,
            total: null,
            search: "",
            loading: false,
            filtersCollapsed: this.props.toggleFilters!,
            sort: this.props.sortModel!,
            chips: this.props.chips!.reduce<ListHandlerChips<RowData>>(
                (acm, { name: chip, enabled = false }) => ({ ...acm, [chip]: enabled }),
                {} as any,
            ),
        };
        this.prevState = { ...this.state };
    };

    private setLoading = (loading: boolean) => this.isMountedFlag && this.setState((prevState) => ({ ...prevState, loading }));
    private setFiltersCollapsed = (filtersCollapsed: boolean) => this.isMountedFlag && this.setState((prevState) => ({ ...prevState, filtersCollapsed }));

    public componentDidUpdate = () => {
        this.handleUpdateRef();
        this.beginFetchQueue();
    };

    public componentDidMount = () => {
        this.isMountedFlag = true;
        this.handleEmptyFilters();
        this.handleUpdateRef();
    };

    public componentWillUnmount = () => {
        this.isFetchingFlag = false;
        this.isMountedFlag = false;
        this.handleFetchQueue.clear();
    };

    private beginFetchQueue = () => {
        if (this.prevState.filtersCollapsed === this.state.filtersCollapsed) {
            this.handleFetchQueue();
        } else {
            this.prevState.filtersCollapsed = this.state.filtersCollapsed;
        }
    };

    private handleFetchQueue = debounce(() => {
        const updateQueue = [
            this.handlePageChanged,
            this.handleParamsChanged
        ];
        let isOk = true;
        isOk = isOk && !this.state.loading;
        isOk = isOk && this.state.initComplete;
        if (isOk) {
            if (!this.isFetchingFlag) {
                return;
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
        this.prevState = {...this.state};
    }, LIST_FETCH_DEBOUNCE);

    private handlePageChanged = () => {
        let isOk = false;
        isOk = isOk || this.prevState.offset === this.state.offset;
        isOk = isOk || this.prevState.limit === this.state.limit;
        if (isOk) {
            this.handleReload();
        }
        return isOk;
    };

    private handleParamsChanged = () => {
        let isOk = false;
        isOk = isOk || this.prevState.chips === this.state.chips;
        isOk = isOk || this.prevState.sort === this.state.sort;
        isOk = isOk || this.prevState.search === this.state.search;
        if (isOk) {
            this.handleFilter(this.state.filterData, false);
        }
        return isOk;
    };

    private handleUpdateRef = () => {
        const { apiRef } = this.props;
        const instance: IListApi = {
            reload: this.handleReload,
        };
        if (typeof apiRef === 'function') {
            apiRef(instance);
        } else if (apiRef) {
            (apiRef.current as any) = instance;
        }
    };

    private handleEmptyFilters = () => {
        const hasFilters = Array.isArray(this.props.filters) && !!this.props.filters.length;
        if (!hasFilters) {
          this.handleDefault();
        }
        this.prevState.filtersCollapsed = this.state.filtersCollapsed;
    };

    private handleRows = async (filterData: FilterData, keepPagination = false): Promise<{
        rows: RowData[];
        total: number | null;
    }> => {
        if (typeof this.props.handler === 'function') {
            const response: ListHandlerResult<RowData> = await Promise.resolve(this.props.handler(filterData, {
                limit: this.state.limit,
                offset: keepPagination ? this.state.offset : 0,
            }, this.state.sort, this.state.chips, this.state.search));
            if (Array.isArray(response)) {
                response.length > this.state.limit && console.warn("List rows count is more than it's capacity");
                return {
                    rows: response.slice(0, this.state.limit),
                    total: null,
                };
            } else {
                const { rows = [], total = null } = response || {};
                rows.length > this.state.limit && console.warn("List rows count is more than it's capacity");
                return { rows: rows.slice(0, this.state.limit), total };
            }
        } else {
            if (Array.isArray(this.props.handler)) {
                return {
                    rows: this.props.handler.slice(this.state.offset, this.state.limit + this.state.offset),
                    total: this.props.handler.length,
                };
            } else {
                const { rows = [], total = null } = this.props.handler || {};
                return {
                    rows: rows.slice(this.state.offset, this.state.limit + this.state.offset),
                    total,
                };
            }
        }
    };

    private handleFilter = async (filterData: FilterData, keepPagination = false) => {
        if (this.state.loading) {
            return;
        }
        this.setLoading(true);
        try {
            const {
                rows,
                total,
            } = await this.handleRows(filterData, keepPagination);
            if (!keepPagination) {
                scrollManager.scrollTop();
            }
            this.isMountedFlag && this.setState((prevState) => ({
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

    private handleDefault = async () => {
        const newData: Partial<FilterData> = {};
        deepFlat(this.props.filters)
            .filter(({ name }) => !!name)
            .map(({ type, name }) => {
                set(newData, name, initialValue(type));
            });
        await this.handleFilter(newData as FilterData);
    };

    private handleReload = async (keepPagination = true) => {
        await this.handleFilter(this.state.filterData, keepPagination);
    };

    private handlePageChange = (page: number) => {
        this.isFetchingFlag = true;
        this.isMountedFlag && this.setState((prevState) => ({
            ...prevState,
            offset: page * this.state.limit,
        }));
        this.props.onPageChange!(page);
    };

    private handleLimitChange = (newLimit: number) => {
        this.isFetchingFlag = true;
        const newPage = Math.floor(this.state.offset / newLimit);
        this.isMountedFlag && this.setState((prevState) => ({
            ...prevState,
            offset: newPage * newLimit,
            limit: newLimit,
        }));
        this.props.onLimitChange!(newLimit);
    };

    private handleSortModel = (sort: ListHandlerSortModel) => {
        this.isFetchingFlag = true;
        this.isMountedFlag && this.setState((prevState) => ({
          ...prevState,
          offset: 0,
          sort,
        }));
        this.props.onSortModelChange!(sort);
    };


    private handleChips = (chips: ListHandlerChips) => {
        this.isFetchingFlag = true;
        this.isMountedFlag && this.setState((prevState) => ({
          ...prevState,
          offset: 0,
          chips,
        }));
        this.props.onChipsChange!(chips);
    };

    private handleSearch = (search: string) => {
        this.isFetchingFlag = true;
        this.isMountedFlag && this.setState((prevState) => ({
          ...prevState,
          offset: 0,
          search,
        }));
        this.props.onSearchChange!(search);
    };

    private handleFiltersCollapsed = (filtersCollapsed: boolean) => this.setFiltersCollapsed(filtersCollapsed);

    private getCallbacks = (): IListCallbacks => ({
        handlePageChange: this.handlePageChange,
        handleLimitChange: this.handleLimitChange,
        handleSortModel: this.handleSortModel,
        handleDefault: this.handleDefault,
        handleFilter: this.handleFilter,
        handleReload: this.handleReload,
        handleChips: this.handleChips,
        handleSearch: this.handleSearch,
        handleFiltersCollapsed: this.handleFiltersCollapsed,
        ready: this.handleDefault,
    });

    public renderInner = () => {
        const callbacks = this.getCallbacks();
        if (this.props.isChooser) {
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

    public render = () => {
        const callbacks = this.getCallbacks();
        return (
            <ThemeProvider>
                <PropProvider {...{ ...this.props, ...this.state, ...callbacks }}>
                    <SelectionProvider selectedRows={this.props.selectedRows}>
                        <CachedRowsProvider>
                            <SortModelProvider sortModel={this.props.sortModel!}>
                                <ChipsProvider chips={this.props.chips!}>
                                    <ModalSortProvider>
                                        {this.renderInner()}
                                    </ModalSortProvider>
                                </ChipsProvider>
                            </SortModelProvider>
                        </CachedRowsProvider>
                    </SelectionProvider>
                </PropProvider>
            </ThemeProvider>
        );
    };

};

export const ListTyped = <
    FilterData extends IAnything = IAnything,
    RowData extends IRowData = IAnything,
>(
    props: IListProps<FilterData, RowData, TypedField<FilterData>>,
) => <List<FilterData, RowData> {...props} />;

export default List;
