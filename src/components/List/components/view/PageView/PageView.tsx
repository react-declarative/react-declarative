import * as React from "react";
import { useEffect, useMemo } from "react";

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

import useScrollManager from "../../../hooks/useScrollManager";
import useSubject from "../../../../../hooks/useSubject";
import useSelection from "../../../hooks/useSelection";

import useElementSize from "../../../../../hooks/useElementSize";
import useUpsertManager from "../../../hooks/useUpsertManager";

import DefaultTemplate from "./components/DefaultTemplate";

import TablePagination from "../../TablePagination";
import Container from "../../Container";
import Tile from "../../../../Tile";

const DEFAULT_ITEM_SIZE = 45;
const PAGINATION_HEIGHT = 52;
const ROWS_PER_PAGE = [10, 25, 50];

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
 * @interface IPageProps
 *
 * Represents the page props for a list component.
 * @template FilterData - The type of data for filters.
 * @template RowData - The type of data for each row in the list.
 */
interface IPageProps<
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
        isPageItem: never;
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
 * PageView component represents list with infinite scroll behaviour and page template.
 *
 * @template FilterData - The type of filter data.
 * @template RowData - The type of row data.
 *
 * @param props - The props object containing the necessary parameters.
 * @returns - The PageView component.
 */
export const PageView = <
  FilterData extends {} = IAnything,
  RowData extends IRowData = IAnything
>(
  props: IPageProps<FilterData, RowData>
) => {
  const { classes } = useStyles();

  const scrollManager = useScrollManager();
  const scrollYSubject = useSubject<number>();

  useEffect(() => scrollManager.scrollYSubject.subscribe(() => {
    scrollYSubject.next(0);
  }), []);

  const { selection, setSelection } = useSelection();

  const {
    rows,
    offset,
    limit,
    total,
    payload,
    rowMark,
    rowColor,
    selectionMode = SelectionMode.None,
    pageItemTemplate: PageTemplate = DefaultTemplate,
    pageItemTemplateMinHeight = DEFAULT_ITEM_SIZE,
    labelDisplayedRows,
    onRowClick,
    tileMode,
  } = props;

  const state = useUpsertManager({
    rows: props.rows,
    scrollYSubject,
  });

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

  const { handlePageChange, handleLimitChange } = props;

  const handleDirtyLimitChange = (e: any) => handleLimitChange(e.target.value);

  const handleDirtyPageChange = (_: any, newPage: number) =>
    handlePageChange(newPage);

  return (
    <Container<FilterData, RowData> {...props}>
      <Box ref={elementRef} className={classes.root}>
        <Box className={classes.container}>
          <Box position="relative" style={{ height: rootHeight- PAGINATION_HEIGHT, width: rootWidth }}>
            <Tile
              mode={tileMode}
              recomputeSubject={state.recomputeSubject}
              scrollYSubject={scrollYSubject}
              minRowHeight={pageItemTemplateMinHeight}
              hasMore={false}
              loading={false}
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
              data={rows}
              onItemClick={({ data }) => {
                handleRowClick(data);
              }}
              sx={{ height: rootHeight- PAGINATION_HEIGHT, width: rootWidth }}
            >
              {PageTemplate}
            </Tile>
          </Box>
          <TablePagination
            width={rootWidth}
            height={rootHeight}
            count={total || -1}
            rowsPerPage={limit}
            page={offset / limit}
            labelDisplayedRows={labelDisplayedRows}
            rowsPerPageOptions={ROWS_PER_PAGE}
            onPageChange={handleDirtyPageChange}
            onRowsPerPageChange={handleDirtyLimitChange}
          />
        </Box>
      </Box>
    </Container>
  );
};

export default PageView;
