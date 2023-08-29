import * as React from "react";
import { forwardRef, useEffect } from "react";
import { makeStyles } from "../../../../styles";

import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";

import classNames from "../../../../utils/classNames";

import AutoSizer, { IAutoSizerProps, IChildParams } from "../../../AutoSizer";

import IListProps, {
  IListState,
  IListCallbacks,
} from "../../../../model/IListProps";
import IAnything from "../../../../model/IAnything";
import IRowData from "../../../../model/IRowData";

import usePayload from "../../hooks/usePayload";
import usePagination from "../../hooks/usePagination";
import useConstraintManager from "../../hooks/useConstraintManager";

import OperationListSlot from "../../slots/OperationListSlot";
import ActionListSlot from "../../slots/ActionListSlot";
import FilterListSlot from "../../slots/FilterListSlot";
import ChipListSlot from "../../slots/ChipListSlot";
import SearchSlot from "../../slots/SearchSlot";

const CONTAINER_MARK = "react-declarative__contentMark";
const EMPTY_ARRAY: any[] = [];

interface IContainerProps<
  FilterData extends {} = IAnything,
  RowData extends IRowData = IAnything
> extends Omit<
      IListProps<FilterData, RowData>,
      keyof {
        ref: never;
        limit: never;
        chips: never;
        search: never;
        filterData: never;
        isChooser: never;
        payload: never;
      }
    >,
    IListState<FilterData, RowData>,
    IListCallbacks<FilterData, RowData> {
  className?: string;
  style?: React.CSSProperties;
  children: (s: IChildParams<IContainerProps<FilterData, RowData>>) => any;
  ready: () => void;
  listChips: IListProps["chips"];
  ref?: (instance: HTMLDivElement) => void;
  onResize?: IAutoSizerProps["onResize"];
}

const useStyles = makeStyles()({
  root: {
    position: "relative",
    height: "100%",
    width: "100%",
  },
  container: {
    position: "absolute",
    top: 0,
    left: 0,
  },
  content: {
    display: "flex",
    alignItems: "stretch",
    justifyContent: "stretch",
    flexDirection: "column",
    overflow: "hidden",
  },
  stretch: {
    flex: 1,
  },
  noElevation: {
    background: "transparent",
  },
  beforeActionList: {
    width: "100%",
    display: "flex",
    alignItems: "stretch",
    justifyContent: "stretch",
    "& > *": {
      flex: 1,
    },
  },
  afterActionList: {
    width: "100%",
    display: "flex",
    alignItems: "stretch",
    justifyContent: "stretch",
    "& > *": {
      flex: 1,
    },
  },
});

export const Container = <
  FilterData extends {} = IAnything,
  RowData extends IRowData = IAnything
>(
  props: IContainerProps<FilterData, RowData>,
  ref: any
) => {
  const { classes } = useStyles();

  const payload = usePayload();
  const pagination = usePagination();

  const { constraintManager } = useConstraintManager();

  const {
    className,
    style,
    filters = [],
    actions = [],
    listChips,
    heightRequest = (v) => v,
    widthRequest = (v) => v,
    operations,
    title = "",
    filterLabel = "",
    filterData,
    handleFilter,
    handleDefault,
    handleChips,
    handleLimitChange,
    handlePageChange,
    handleReload,
    handleRerender,
    handleRowsChange,
    handleSortModel,
    children,
    isChooser,
    ready,
    loading,
    withToggledFilters,
    onFilterChange,
    withSearch = false,
    search,
    sortModel = EMPTY_ARRAY,
    chips,
    handleSearch,
    handleFiltersCollapsed,
    sizeByParent = true,
    rerender = false,
    BeforeActionList,
    AfterActionList,
  } = props;


  useEffect(() => {
    constraintManager.clear();
  }, [
    filterData,
    pagination,
    sortModel,
    chips,
    search,
    payload,
  ]);

  const sizer = {
    ...(!sizeByParent && {
      target: document.body,
    }),
  };

  return (
    <AutoSizer
      className={classNames(classes.root, className, CONTAINER_MARK)}
      style={style}
      heightRequest={heightRequest}
      widthRequest={widthRequest}
      payload={props}
      {...sizer}
    >
      {({ height, width, payload }) => (
        <div className={classes.container}>
          <div ref={ref} style={{ height, width }} className={classes.content}>
            {BeforeActionList && (
              <Box className={classes.beforeActionList}>
                <BeforeActionList
                  filterData={filterData}
                  chips={chips}
                  pagination={pagination}
                  payload={payload}
                  search={search}
                  sortModel={sortModel}
                  handleFilter={handleFilter}
                  handleDefault={handleDefault}
                  handleChips={handleChips}
                  handleLimitChange={handleLimitChange}
                  handlePageChange={handlePageChange}
                  handleReload={handleReload}
                  handleRerender={handleRerender}
                  handleRowsChange={handleRowsChange}
                  handleSortModel={handleSortModel}
                  handleSearch={handleSearch}
                  handleFiltersCollapsed={handleFiltersCollapsed}
                />
              </Box>
            )}
            {Array.isArray(actions) && !!actions.length && (
              <ActionListSlot
                height={height}
                width={width}
                title={title}
                filterData={filterData!}
                actions={actions}
              />
            )}
            {AfterActionList && (
              <Box className={classes.afterActionList}>
                <AfterActionList
                  filterData={filterData}
                  chips={chips}
                  pagination={pagination}
                  payload={payload}
                  search={search}
                  sortModel={sortModel}
                  handleFilter={handleFilter}
                  handleDefault={handleDefault}
                  handleChips={handleChips}
                  handleLimitChange={handleLimitChange}
                  handlePageChange={handlePageChange}
                  handleReload={handleReload}
                  handleRerender={handleRerender}
                  handleRowsChange={handleRowsChange}
                  handleSortModel={handleSortModel}
                  handleSearch={handleSearch}
                  handleFiltersCollapsed={handleFiltersCollapsed}
                />
              </Box>
            )}
            {Array.isArray(operations) && !!operations.length && (
              <OperationListSlot operations={operations} width={width} />
            )}
            <Paper
              className={classNames(classes.content, classes.stretch, {
                [classes.noElevation]: isChooser,
              })}
            >
              {!isChooser && Array.isArray(filters) && !!filters.length && (
                <FilterListSlot
                  filterData={filterData!}
                  withToggledFilters={withToggledFilters}
                  onFilterChange={onFilterChange}
                  change={handleFilter}
                  onSearchChange={handleSearch}
                  onCollapsedChange={handleFiltersCollapsed}
                  clean={handleDefault}
                  label={filterLabel}
                  filters={filters}
                  ready={ready}
                  loading={loading}
                  search={search}
                  height={height}
                  width={width}
                  withSearch={withSearch}
                />
              )}
              {!isChooser &&
                (!Array.isArray(filters) || !filters.length) &&
                withSearch && (
                  <SearchSlot
                    onSearchChange={handleSearch}
                    clean={handleDefault}
                    search={search}
                    height={height}
                    width={width}
                    loading={loading}
                    label={filterLabel}
                  />
                )}
              {!isChooser && Array.isArray(listChips) && !!listChips.length && (
                <ChipListSlot listChips={listChips} loading={loading} />
              )}
              <div className={classNames(classes.content, classes.stretch)}>
                {!rerender && (
                  <AutoSizer payload={payload} onResize={props.onResize}>
                    {children}
                  </AutoSizer>
                )}
              </div>
            </Paper>
          </div>
        </div>
      )}
    </AutoSizer>
  );
};

export default forwardRef(Container) as typeof Container;
