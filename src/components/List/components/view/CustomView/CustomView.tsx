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
import DefaultTemplate from "./components/DefaultTemplate";

import Container from "../../Container";
import Tile from "../../../../Tile";

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
 * @interface ICustomProps
 *
 * Represents the custom props for a list component.
 * @template FilterData - The type of data for filters.
 * @template RowData - The type of data for each row in the list.
 */
interface ICustomProps<
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
 * Represents a custom state for a specific functionality.
 *
 * @interface ICustomState
 * @template FilterData - The type of the filter data.
 * @template RowData - The type of the row data.
 */
interface ICustomState<
  FilterData extends {} = IAnything,
  RowData extends IRowData = IAnything
> {
  rows: ICustomProps<FilterData, RowData>["rows"];
  filterData: ICustomProps<FilterData, RowData>["filterData"];
}

/**
 * CustomView component represents list with infinite scroll behaviour and custom template.
 *
 * @template FilterData - The type of filter data.
 * @template RowData - The type of row data.
 *
 * @param props - The props object containing the necessary parameters.
 * @returns - The CustomView component.
 */
export const CustomView = <
  FilterData extends {} = IAnything,
  RowData extends IRowData = IAnything
>(
  props: ICustomProps<FilterData, RowData>
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
    selectionMode = SelectionMode.None,
    customTemplate: CustomTemplate = DefaultTemplate,
    customTemplateMinHeight = DEFAULT_ITEM_SIZE,
    withLoader = false,
    onRowClick,
  } = props;

  const reload = useReload();

  const selectedRows = useMemo(() => {
    return [...selection] as string[]
  }, [selection]);

  /**
   * Handles the click event of a row.
   * If `withSelectOnRowClick` prop is true and `selectionMode` is not `SelectionMode.None`,
   * it handles the selection logic based on the `selectionMode`.
   * Otherwise, it invokes `onRowClick` callback with the clicked `row` and `reload` function.
   *
   * @param row - The clicked row.
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

  const [state, setState] = useState<ICustomState>({
    rows: upperRows,
    filterData: upperFilterData,
  });

  /**
   * Handles cleaning the rows and updating the state.
   *
   * @function handleCleanRows
   * @callback
   *
   * @param setState - The function to set the state.
   * @param upperRows - The updated rows.
   * @param upperFilterData - The updated filter data.
   *
   * @returns
   */
  const handleCleanRows = useCallback(() => {
    setState(() => ({
      rows: upperRows,
      filterData: upperFilterData,
    }));
    scrollYSubject.next(0);
  }, [upperRows, upperFilterData]);

  /**
   * A callback function used to handle appending rows to the state.
   *
   * @callback handleAppendRows
   * @returns
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
   * Handles the data request.
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
            <Tile
              scrollYSubject={scrollYSubject}
              minRowHeight={customTemplateMinHeight}
              hasMore={hasMore}
              bufferSize={limit * 2}
              selectedRows={selectedRows}
              onSelectedRows={(ids, initial) => {
                if (!initial) {
                  setSelection(new Set(ids));
                }
              }}
              selectionMode={selectionMode}
              payload={payload}
              rowMark={rowMark}
              rowKey="id"
              rowColor={rowColor}
              data={state.rows}
              onSkip={async () => void await handleDataRequest()}
              onItemClick={({ data }) => {
                handleRowClick(data);
              }}
              sx={{ height: rootHeight, width: rootWidth }}
            >
              {CustomTemplate}
            </Tile>
            <ModalLoader open={withLoader && loading} />
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default CustomView;
