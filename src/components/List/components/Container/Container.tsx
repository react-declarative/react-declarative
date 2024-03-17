import * as React from "react";
import { forwardRef, useEffect, useMemo } from "react";
import { makeStyles } from "../../../../styles";

import Box from "@mui/material/Box";

import classNames from "../../../../utils/classNames";

import { IAutoSizerProps } from "../../../AutoSizer";
import PaperView from "../../../PaperView";

import IListProps, {
  IListState,
  IListCallbacks,
} from "../../../../model/IListProps";
import IAnything from "../../../../model/IAnything";
import IRowData from "../../../../model/IRowData";

import usePayload from "../../hooks/usePayload";
import usePagination from "../../hooks/usePagination";
import useConstraintManager from "../../hooks/useConstraintManager";
import useRowDisabledMap from "../../hooks/useRowDisabledMap";

import useElementSize from "../../../../hooks/useElementSize";
import useMediaContext from "../../../../hooks/useMediaContext";

import OperationListSlot from "../../slots/OperationListSlot";
import ActionListSlot from "../../slots/ActionListSlot";
import FilterListSlot from "../../slots/FilterListSlot";
import ChipListSlot from "../../slots/ChipListSlot";
import SearchSlot from "../../slots/SearchSlot";

export const CONTAINER_MARK = "react-declarative__contentMark";

const EMPTY_ARRAY: any[] = [];
const RESIZE_DELAY = 100;

interface IContainerProps<
  FilterData extends {} = IAnything,
  RowData extends IRowData = IAnything,
> extends Omit<
      IListProps<FilterData, RowData>,
      keyof {
        ref: never;
        limit: never;
        chips: never;
        search: never;
        filterData: never;
        isChooser: never;
        isInfinite: never;
        isCustom: never;
        payload: never;
      }
    >,
    IListState<FilterData, RowData>,
    IListCallbacks<FilterData, RowData> {
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
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
    position: "relative",
    display: "flex",
    alignItems: "stretch",
    justifyContent: "stretch",
    flexDirection: "column",
    overflow: "hidden",
  },
  inner: {
    position: "absolute",
    top: 0,
    left: 0,
    display: "flex",
    alignItems: "stretch",
    justifyContent: "stretch",
    flexDirection: "column",
    overflow: "hidden",
    "& > :nth-of-type(1)": {
      flex: 1,
    },
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
  hidden: {
    display: "none",
  },
});

/**
 * Represents a Container component.
 *
 * @template FilterData - The type of the filter data.
 * @template RowData - The type of the row data.
 *
 * @param props - The props for the Container component.
 * @param ref - The ref object.
 *
 * @returns The rendered Container component.
 */
export const Container = <
  FilterData extends {} = IAnything,
  RowData extends IRowData = IAnything,
>(
  props: IContainerProps<FilterData, RowData>,
  ref: any
) => {
  const { classes } = useStyles();

  const payload = usePayload();
  const pagination = usePagination();

  const { constraintManager } = useConstraintManager();
  const [rowDisabledMap] = useRowDisabledMap();

  const { isMobile } = useMediaContext();

  const {
    className,
    style,
    filters = [],
    actions = [],
    listChips,
    denseHeight,
    isDense: isDenseProp,
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
    initComplete,
    children,
    isChooser,
    ready,
    loading,
    withToggledFilters,
    onFilterChange,
    onResize,
    withSearch = false,
    search,
    sortModel = EMPTY_ARRAY,
    chips,
    handleSearch,
    handleFiltersCollapsed,
    sizeByElement = true,
    withOutlinePaper = false,
    withTransparentPaper = false,
    rerender = false,
    BeforeActionList,
    AfterActionList,
    BeforeOperationList,
    AfterOperationList,
  } = props;

  const { elementRef: rootElementRef, size: rootElementSize } = useElementSize({
    target: sizeByElement ? undefined : document.body,
    debounce: RESIZE_DELAY,
    compute: ({ height, width }) => ({
      height: heightRequest(height),
      width: widthRequest(width),
    }),
    onResize,
  });

  const isDense = useMemo(() => {
    if (isDenseProp) {
      return true;
    }
    if (isMobile) {
      return false;
    }
    const { height } = rootElementSize;
    if (denseHeight) {
      return denseHeight > height;
    }
    return false;
  }, [denseHeight, rootElementSize.height, isMobile, isDenseProp]);

  const { elementRef: contentElementRef, size: contentElementSize } =
    useElementSize({
      debounce: RESIZE_DELAY,
    });

  useEffect(() => {
    constraintManager.clear();
    rowDisabledMap.clear();
  }, [filterData, pagination, sortModel, chips, search, payload]);

  return (
    <Box
      ref={rootElementRef}
      className={classNames(classes.root, className, CONTAINER_MARK)}
      style={style}
    >
      <div className={classes.container}>
        <div
          ref={ref}
          style={rootElementSize}
          className={classNames(classes.content, classes.stretch)}
        >
          {initComplete && (
            <div
              className={classNames({
                [classes.hidden]: isDense,
              })}
            >
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
            </div>
          )}

          <div>
            {Array.isArray(actions) && !!actions.length && (
              <ActionListSlot
                height={rootElementSize.height}
                width={rootElementSize.width}
                title={title}
                filterData={filterData!}
                actions={actions}
              />
            )}
          </div>

          {initComplete && (
            <div
              className={classNames({
                [classes.hidden]: isDense,
              })}
            >
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
            </div>
          )}

          {initComplete && (
            <div
              className={classNames({
                [classes.hidden]: isDense,
              })}
            >
              {BeforeOperationList && (
                <Box className={classes.beforeActionList}>
                  <BeforeOperationList
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
            </div>
          )}

          <div
            className={classNames({
              [classes.hidden]: isDense,
            })}
          >
            {Array.isArray(operations) && !!operations.length && (
              <OperationListSlot
                operations={operations}
                width={rootElementSize.width}
              />
            )}
          </div>

          {initComplete && (
            <div
              className={classNames({
                [classes.hidden]: isDense,
              })}
            >
              {AfterOperationList && (
                <Box className={classes.beforeActionList}>
                  <AfterOperationList
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
            </div>
          )}
          <PaperView
            className={classNames(classes.content, classes.stretch, {
              [classes.noElevation]: isChooser,
            })}
            outlinePaper={withOutlinePaper}
            transparentPaper={withTransparentPaper}
          >
            <div>
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
                  height={rootElementSize.height}
                  width={rootElementSize.width}
                  withSearch={withSearch}
                />
              )}
            </div>
            <div>
              {!isChooser &&
                (!Array.isArray(filters) || !filters.length) &&
                withSearch && (
                  <SearchSlot
                    onSearchChange={handleSearch}
                    clean={handleDefault}
                    search={search}
                    height={rootElementSize.height}
                    width={rootElementSize.width}
                    loading={loading}
                    label={filterLabel}
                  />
                )}
            </div>
            <div
              className={classNames({
                [classes.hidden]: isDense,
              })}
            >
              {!isChooser && Array.isArray(listChips) && !!listChips.length && (
                <ChipListSlot listChips={listChips} loading={loading} />
              )}
            </div>
            <Box
              ref={contentElementRef}
              className={classNames(classes.content, classes.stretch)}
            >
              <div className={classes.inner} style={contentElementSize}>
                {!rerender && <>{children}</>}
              </div>
            </Box>
          </PaperView>
        </div>
      </div>
    </Box>
  );
};

export default forwardRef(Container) as typeof Container;
