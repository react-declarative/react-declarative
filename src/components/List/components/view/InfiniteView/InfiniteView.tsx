import * as React from "react";
import { useState, useEffect, useCallback, useMemo } from "react";

import { makeStyles } from "../../../../../styles";

import Box from "@mui/material/Box";

import IListProps, {
  IListState,
  IListCallbacks,
} from "../../../../../model/IListProps";

import SelectionMode from "../../../../../model/SelectionMode";
import IAnything from "../../../../../model/IAnything";
import IRowData from "../../../../../model/IRowData";

import useReload from "../../../hooks/useReload";

import useSubject from "../../../../../hooks/useSubject";
import useSelection from "../../../hooks/useSelection";

import useElementSize from "../../../../../hooks/useElementSize";
import useRenderWaiter from "../../../../../hooks/useRenderWaiter";
import useSinglerunAction from "../../../../../hooks/useSinglerunAction";

import ModalLoader from "./components/ModalLoader";

import Container from "../../Container";
import Grid from "../../../../Grid";

import list2grid from "../../../../../utils/list2grid";

const DEFAULT_ITEM_SIZE = 45;

export const MOBILE_LIST_ROOT = "react-declarative__mobileListRoot";

const useStyles = makeStyles()((theme) => ({
  root: {
    position: "relative",
  },
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    background: theme.palette.background.paper,
  },
  empty: {
    position: "absolute",
    zIndex: 999,
    top: 0,
    left: 0,
    right: 0,
  },
}));

/**
 * Interface for the IInfiniteProps class.
 * @template FilterData - The type of filter data.
 * @template RowData - The type of row data.
 */
interface IInfiniteProps<
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
        isInfinite: never;
        isCustom: never;
        payload: never;
      }
    >,
    IListState<FilterData, RowData>,
    IListCallbacks<FilterData, RowData> {
  className?: string;
  style?: React.CSSProperties;
  listChips: IListProps["chips"];
}

/**
 * Represents an infinite state interface.
 *
 * @template FilterData - The type of filter data.
 * @template RowData - The type of row data.
 */
interface IInfiniteState<
  FilterData extends {} = IAnything,
  RowData extends IRowData = IAnything
> {
  rows: IInfiniteProps<FilterData, RowData>["rows"];
  filterData: IInfiniteProps<FilterData, RowData>["filterData"];
}

/**
 * InfiniteView component represents list table with infinite scroll behaviour.
 *
 * @template FilterData - The type of filter data.
 * @template RowData - The type of row data.
 *
 * @param props - The props object containing the necessary parameters.
 * @returns - The InfiniteView component.
 */
export const InfiniteView = <
  FilterData extends {} = IAnything,
  RowData extends IRowData = IAnything
>(
  props: IInfiniteProps<FilterData, RowData>
) => {
  const { classes } = useStyles();

  const scrollYSubject = useSubject<number>();

  const { selection, setSelection } = useSelection();

  const {
    rows: upperRows,
    filterData: upperFilterData,
    offset,
    limit,
    total,
    loading,
    payload,
    rowMark,
    rowColor,
    columns: listColumns,
    selectionMode = SelectionMode.None,
    withLoader = false,
    onRowClick,
    onRowAction
  } = props;

  const reload = useReload();

  /**
   * @function gridColumns
   * @description Returns a memoized value for the grid columns array
   * @returns {Array} The grid columns array
   */
  const gridColumns = useMemo(() => {
    return list2grid(listColumns, payload);
  }, []);

  /**
   * @description selectedRows represents an array of selected rows.
   *
   * @type {Array<string>}
   *
   * @param {Array<any>} selection - The array of selected items.
   *
   * @returns {Array<string>} - The selected rows as an array of strings.
   */
  const selectedRows = useMemo(() => {
    return [...selection] as string[]
  }, [selection]);

  /**
   * Handles the click event on a row.
   *
   * @param row - The clicked row object.
   * @returns
   */
  const handleRowClick = (row: any) => {
    if (
      props.withSelectOnRowClick &&
      props.selectionMode !== SelectionMode.None
    ) {
      if (props.selectionMode === SelectionMode.Single) {
        if (selection.has(row.id) && selection.size === 1) {
          selection.delete(row.id);
        } else {
          selection.clear();
          selection.add(row.id);
        }
      } else {
        selection.has(row.id)
          ? selection.delete(row.id)
          : selection.add(row.id);
      }
      setSelection(selection);
    } else {
      onRowClick && onRowClick(row, reload);
    }
  };

  const { elementRef, size: { height: rootHeight, width: rootWidth } } = useElementSize();

  const { handlePageChange } = props;

  const [state, setState] = useState<IInfiniteState>({
    rows: upperRows,
    filterData: upperFilterData,
  });

  /**
   * Updates the state with clean rows and filter data.
   * Resets the scroll position to the top.
   *
   * @function handleCleanRows
   * @returns {void}
   */
  const handleCleanRows = useCallback(() => {
    setState(() => ({
      rows: upperRows,
      filterData: upperFilterData,
    }));
    scrollYSubject.next(0);
  }, [upperRows, upperFilterData]);

  /**
   * Handles appending rows to state.
   *
   * This function is used with the useCallback hook to memoize any changes to the function reference.
   * It appends new rows to the existing rows in state by filtering out rows with duplicate ids.
   *
   * @returns {void}
   */
  const handleAppendRows = useCallback(
    () =>
      setState(({ rows, ...state }) => {
        const rowIds = new Set(rows.map(({ id }) => id));
        return {
          ...state,
          rows: [...rows, ...upperRows.filter(({ id }) => !rowIds.has(id))],
        };
      }),
    [state, upperRows]
  );

  useEffect(() => handleAppendRows(), [upperRows]);
  useEffect(() => handleCleanRows(), [upperFilterData]);

  const pendingPage = Math.floor(offset / limit) + 1;
  const hasMore = !total || pendingPage * limit < total;

  const waitForRequest = useRenderWaiter([loading]);

  /**
   * Handles the request for data.
   *
   * @param {Object} request - The request object containing the necessary data parameters.
   * @returns {Promise} - A promise that resolves with the requested data.
   *
   * @throws {Error} - If the request is invalid or fails.
   */
  const { execute: handleDataRequest } = useSinglerunAction(async () => {
    let isOk = true;
    isOk = isOk && hasMore;
    isOk = isOk && !loading;
    if (isOk) {
      handlePageChange(pendingPage);
      await waitForRequest();
    }
  });

  return (
    <Container<FilterData, RowData> {...props} {...state}>
      <Box ref={elementRef} className={classes.root}>
        <Box className={classes.container}>
          <Box position="relative" style={{ height: rootHeight, width: rootWidth }}>
            <Grid
              scrollYSubject={scrollYSubject}
              minRowHeight={DEFAULT_ITEM_SIZE}
              hasMore={hasMore}
              bufferSize={limit * 2}
              selectedRows={selectedRows}
              onSelectedRows={(ids, initial) => {
                if (!initial) {
                  setSelection(new Set(ids));
                }
              }}
              selectionMode={selectionMode}
              transparentPaper
              payload={payload}
              rowMark={rowMark}
              onRowClick={handleRowClick}
              onRowAction={(action, row) => {
                onRowAction && onRowAction(action, row, reload);
              }}
              rowKey="id"
              rowColor={rowColor}
              columns={gridColumns}
              data={state.rows}
              onSkip={async () => void await handleDataRequest()}
              sx={{ height: rootHeight, width: rootWidth }}
            />
            <ModalLoader open={withLoader && loading} />
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default InfiniteView;
