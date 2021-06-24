import * as React from 'react';
import { useState, useLayoutEffect, useRef } from 'react';
import { makeStyles } from '@material-ui/core';

import { DataGrid } from '@material-ui/data-grid';
import Paper from '@material-ui/core/Paper';

import classNames from '../../utils/classNames';

import AutoSizer from '../../components/common/AutoSizer';

import IListProps from '../../model/IListProps';
import TypedField from '../../model/TypedField';
import IAnything from '../../model/IAnything';

import Actions from './Actions';
import Filters from './Filters';

import initialValue from '../../config/initialValue';
import deepFlat from '../../utils/deepFlat';
import set from '../../utils/set';
const AUTOSIZER_DELAY = 50;

const useStyles = makeStyles({
  root: {
  },
  container: {
    display: 'flex',
    alignItems: 'stretch',
    justifyContent: 'stretch',
    flexDirection: 'column',
    '&&& .MuiDataGrid-root': {
      border: '1px solid transparent',
    },
  },
  stretch: {
    flex: 1,
  },
});

interface IListState<FilterData = IAnything, RowData = IAnything> {
  initComplete: boolean;
  filterData: FilterData;
  rows: RowData[];
}

export const List = <FilterData extends IAnything = IAnything, RowData = IAnything>({
  className,
  style,
  filters = [],
  columns = [],
  actions = [],
  heightRequest = (v) => v,
  widthRequest = (v) => v,
  handler = () => [],
  title = 'list-component',
  ...otherProps
}: IListProps<FilterData, RowData>) => {
  const classes = useStyles();

  const [state, setState] = useState<IListState<FilterData, RowData>>({
    initComplete: false,
    filterData: {} as never,
    rows: [] as never,
  });

  const {
    initComplete,
    filterData,
    rows,
  } = state;

  const handleFilter = async (filterData: FilterData) => {
    const rows = await Promise.resolve(handler(filterData)) as RowData[];
    setState({
      initComplete: true,
      filterData,
      rows,
    });
  };

  const handleDefault = () => {
    const newData: Partial<FilterData> = {};
    deepFlat(filters).map(({type, name}) => {
      set(newData, name, initialValue(type));
    });
    handleFilter(newData as FilterData);
  };

  useLayoutEffect(() => {
    setTimeout(() => {
      handleDefault();
    }, 1);
  }, [handler]);

  const {
    ColumnMenu,
    ErrorOverlay,
    Footer,
    Header,
    Toolbar,
    PreferencesPanel,
    LoadingOverlay,
    NoResultsOverlay,
    NoRowsOverlay,
    Pagination,
    FilterPanel,
    ColumnsPanel,
    Panel,
    columnMenuProps,
    errorOverlayProps,
    footerProps,
    headerProps,
    toolbarProps,
    preferencesPanelProps,
    loadingOverlayProps,
    noResultsOverlayProps,
    noRowsOverlayProps,
    paginationProps,
    filterPanelProps,
    columnsPanelProps,
    panelProps,
    ...gridProps
  } = otherProps;

  return (
    <AutoSizer
      className={classNames(classes.root, className)}
      heightRequest={heightRequest}
      widthRequest={widthRequest}
      delay={AUTOSIZER_DELAY}
      style={style}
    >
      {({ height, width }) => (
        <div style={{height, width}} className={classes.container}>
          {Array.isArray(actions) && !!actions.length && (
            <Actions<FilterData>
              filterData={filterData!}
              actions={actions}
            />
          )}
          <Paper className={classNames(classes.container, classes.stretch)}>
            {Array.isArray(filters) && !!filters.length && (
              <Filters<FilterData>
                filterData={filterData!}
                change={handleFilter}
                clean={handleDefault}
                filters={filters}
                title={title}
              />
            )}
            <div className={classNames(classes.container, classes.stretch)}>
              {!!initComplete && (
                <DataGrid
                  {...gridProps}
                  className={classNames(classes.stretch)}
                  columns={columns}
                  rows={rows}
                  components={{
                    ColumnMenu,
                    ErrorOverlay,
                    Footer,
                    Header,
                    Toolbar,
                    PreferencesPanel,
                    LoadingOverlay,
                    NoResultsOverlay,
                    NoRowsOverlay,
                    Pagination,
                    FilterPanel,
                    ColumnsPanel,
                    Panel,
                  }}
                  componentsProps={{
                    columnMenu: columnMenuProps,
                    errorOverlay: errorOverlayProps,
                    footer: footerProps,
                    header: headerProps,
                    toolbar: toolbarProps,
                    preferencesPanel: preferencesPanelProps,
                    loadingOverlay: loadingOverlayProps,
                    noResultsOverlay: noResultsOverlayProps,
                    noRowsOverlay: noRowsOverlayProps,
                    pagination: paginationProps,
                    filterPanel: filterPanelProps,
                    columnsPanel: columnsPanelProps,
                    panel: panelProps,
                  }}
                />
              )}
            </div>
          </Paper>
        </div>
      )}
    </AutoSizer>
  );
};

export const ListTyped = <
  FilterData extends IAnything = IAnything,
  RowData extends IAnything = IAnything
>(props: IListProps<FilterData, RowData, TypedField<FilterData>>) =>
  <List<FilterData, RowData> {...props} />;

List.typed = ListTyped;

export default List;
