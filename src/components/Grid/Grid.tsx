import * as React from "react";
import { useEffect, useMemo } from "react";

import IGridProps from "./model/IGridProps";
import RowData from "./model/RowData";

import Container from "./components/Container";
import Header from "./components/Header";
import Content from "./components/Content";
import Loader from "./components/Loader";

import createConstraintManager from "./helpers/createConstraintManager";

import { ConstraintManagerProvider } from "./hooks/useConstraintManager";
import { GridPropsProvider } from "./hooks/useGridProps";

import useSingleton from "../../hooks/useSingleton";
import useSubject from "../../hooks/useSubject";
import throttle from "../../utils/hof/throttle";

import { DEFAULT_ROW_WIDTH, CELL_MARGIN } from "./config";
import { SelectionProvider } from "./hooks/useSelection";

const createDefaultWidthFn = (columnsLength: number) => (fullWidth: number) => {
  const pendingWidth = Math.floor(fullWidth / columnsLength);
  return Math.max(pendingWidth, DEFAULT_ROW_WIDTH);
};

/**
 * Represents a grid component with customizable features.
 * @template T - The type of row data in the grid.
 * @param props - The properties for the grid.
 * @returns - The grid component.
 */
export const Grid = <T extends RowData>(props: IGridProps<T>) => {
  const {
    className,
    style,
    sx,
    outlinePaper,
    transparentPaper,
    header,
    columns: upperColumns,
    data,
    errorMessage,
    hasMore,
    loading,
    rowActions,
    payload: upperPayload,
    rowKey,
    sort,
    minRowHeight,
    bufferSize,
    onButtonSkip,
    onClickHeaderColumn,
    onRowAction,
    onSkip,
    rowMark,
    onTableRowClick,
    onRowClick,
    recomputeSubject,
    scrollXSubject: upperScrollXSubject,
    scrollYSubject,
  } = props;

  const payload = useSingleton(upperPayload);

  const constraintManager = useSingleton(() => createConstraintManager());

  const scrollXSubject = useSubject<number>(upperScrollXSubject);

  const defaultWidthFn = useMemo(
    () => createDefaultWidthFn(upperColumns.length),
    [upperColumns]
  );

  /**
   * useMemo for creating column array based on upperColumns and defaultWidthFn.
   *
   * @param {Array} upperColumns - Array of columns configuration.
   * @param {Function} defaultWidthFn - Default width function.
   * @return {Array} - Array of columns with calculated width and other properties.
   */
  const columns = useMemo(
    () =>
      upperColumns.map(
        ({ width: upperWidth = defaultWidthFn, minWidth = 0, ...other }) => {
          const width = (fullWidth: number) => {
            const dimension =
              typeof upperWidth === "function"
                ? upperWidth(fullWidth)
                : upperWidth;
            const value =
              typeof dimension === "string" ? parseFloat(dimension) : dimension;
            const adjust = typeof upperWidth === "function" ? CELL_MARGIN : 0;
            return Math.max(value - adjust, minWidth, DEFAULT_ROW_WIDTH);
          };
          return {
            minWidth,
            width,
            ...other,
          };
        }
      ),
    [upperColumns, defaultWidthFn]
  );

  useEffect(() => {
    if (recomputeSubject) {
      return recomputeSubject.subscribe(() => {
        constraintManager.clear();
      });
    }
    return undefined;
  }, [recomputeSubject, constraintManager]);

  /**
   * Creates a memoized throttle function that publishes the scrollX value to the scrollXSubject.
   *
   * @param {number} scrollX - The horizontal scroll value.
   * @returns {Function} - The memoized throttle function.
   */
  const handleScrollX = useMemo(
    () =>
      throttle((scrollX: number) => {
        scrollXSubject.next(scrollX);
      }, 5),
    [scrollXSubject]
  );

  useEffect(
    () => () => {
      handleScrollX.clear();
    },
    [handleScrollX]
  );

  return (
    <ConstraintManagerProvider constraintManager={constraintManager}>
      <GridPropsProvider value={props}>
        <SelectionProvider>
          <Container
            outlinePaper={outlinePaper}
            transparentPaper={transparentPaper}
            className={className}
            header={header}
            style={style}
            sx={sx}
          >
            <Header
              columns={columns}
              sort={sort}
              rowActions={rowActions}
              onClickHeaderColumn={onClickHeaderColumn}
              onScrollX={handleScrollX}
              scrollXSubject={scrollXSubject}
            />
            {!!loading && <Loader />}
            <Content
              recomputeSubject={recomputeSubject}
              rowMark={rowMark}
              columns={columns}
              data={data}
              errorMessage={errorMessage}
              hasMore={hasMore}
              loading={loading}
              rowActions={rowActions}
              payload={payload}
              rowKey={rowKey}
              minRowHeight={minRowHeight}
              bufferSize={bufferSize}
              onSkip={onSkip}
              onTableRowClick={(e, row) => {
                if (onTableRowClick) {
                  onTableRowClick(e, row);
                  return;
                }
                if (onRowClick) {
                  onRowClick(row);
                  return;
                }
              }}
              onRowAction={onRowAction}
              onButtonSkip={onButtonSkip}
              onScrollX={handleScrollX}
              scrollXSubject={scrollXSubject}
              scrollYSubject={scrollYSubject}
            />
          </Container>
        </SelectionProvider>
      </GridPropsProvider>
    </ConstraintManagerProvider>
  );
};

export default Grid;
