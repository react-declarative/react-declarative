import * as React from "react";

import { DataGrid } from "@material-ui/data-grid";

import IListProps, { IListState, IListCallbacks, IRowData } from '../../../../model/IListProps';
import IAnything from '../../../../model/IAnything';

import Container from "../Container";

const ROW_HEIGHT = 75;

interface IDesktopProps<FilterData = IAnything, RowData extends IRowData = IAnything> extends
  IListProps<FilterData, RowData>,
  IListState<FilterData, RowData>,
  IListCallbacks<FilterData, RowData> {
  className?: string;
  style?: React.CSSProperties;
}

export const Desktop = <
  FilterData extends IAnything = IAnything,
  RowData extends IRowData = IAnything,
>(props: IDesktopProps<FilterData, RowData>) => {

  const {
    className,
    style,
    filters = [],
    columns = [],
    actions = [],
    heightRequest = (v) => v,
    widthRequest = (v) => v,
    handler = () => [],
    title = "list-component",
    rowHeight = ROW_HEIGHT,
    filterData,
    handleFilter,
    handleDefault,
    initComplete,
    rows,
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

  return (
    <Container
      {...props}
    >
      {() => (
        <DataGrid
          {...gridProps}
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
          rowHeight={rowHeight}
        />
      )}
    </Container>
  )
};

export default Desktop;
