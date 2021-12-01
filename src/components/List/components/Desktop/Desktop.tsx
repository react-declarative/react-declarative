import * as React from "react";
import { makeStyles } from '@material-ui/core';

import { DataGrid } from "@material-ui/data-grid";

import IListProps, { IListState, IListCallbacks } from '../../../../model/IListProps';
import IAnything from '../../../../model/IAnything';
import IRowData from '../../../../model/IRowData';

import Container from "../Container";

import Checkbox from "./components/CheckBox";
import DefaultHeader from "./components/Header";
import DefaultColumnMenu from "./components/ColumnMenu";

import createColumn from "../../../../config/createColumn";

import useRowClickHandler from "./hooks/useRowClickHandler";

interface IDesktopProps<FilterData = IAnything, RowData extends IRowData = IAnything> extends
  Omit<IListProps<FilterData, RowData>, keyof {
    ref: never;
    limit: never;
    autoReload: never;
  }>,
  IListState<FilterData, RowData>,
  IListCallbacks<FilterData, RowData> {
  className?: string;
  style?: React.CSSProperties;
  rowHeight: number;
}

const useStyles = makeStyles({
  dataGrid: {
    '& .MuiDataGrid-row': {
      position: 'relative',
    },
    '& .MuiDataGrid-columnHeader:last-child .MuiDataGrid-columnSeparator': {
      display: 'none',
    },
  },
});

export const Desktop = <
  FilterData extends IAnything = IAnything,
  RowData extends IRowData = IAnything,
>(props: IDesktopProps<FilterData, RowData>) => {

  const handleRowClick = useRowClickHandler();
  const classes = useStyles();

  const {
    className,
    style,
    filters = [],
    columns = [],
    actions = [],
    heightRequest = (v) => v,
    widthRequest = (v) => v,
    handler = () => [],
    limit,
    total,
    offset,
    sort,
    rowHeight,
    filterData,
    handleFilter,
    handleSortModel,
    handlePageChange,
    handleLimitChange,
    handleDefault,
    initComplete,
    rows,
    onRowClick,
    selectionMode,
    ...otherProps
  } = props;

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

  const pagination: Record<string, unknown> = {
    ...(total !== null && {
      pageSize: limit,
      pagination: true,
      rowCount: total,
      page: Math.floor(offset / limit!),
      paginationMode: "server",
    }),
  };

  return (
    <Container<FilterData, RowData>
      ref={handleRowClick}
      {...props}
    >
      {() => (
        <DataGrid
          {...gridProps}
          {...pagination}
          className={classes.dataGrid}
          disableSelectionOnClick
          checkboxSelection
          columns={props.gridColumns || columns.map(createColumn)}
          sortModel={sort}
          rows={rows}
          components={{
            Header: Header || DefaultHeader,
            ColumnMenu: ColumnMenu || DefaultColumnMenu,
            Checkbox,
            ErrorOverlay,
            Footer,
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
          rowHeight={rowHeight}
          onPageChange={handlePageChange}
          onPageSizeChange={handleLimitChange}
          onSortModelChange={handleSortModel}
        />
      )}
    </Container>
  );
};

export default Desktop;
