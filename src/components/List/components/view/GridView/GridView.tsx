import * as React from "react";
import { useEffect, Fragment } from "react";

import { makeStyles } from "../../../../../styles";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableHead from "@mui/material/TableHead";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";

import TablePagination from "../../TablePagination";

import IListProps, {
  IListState,
  IListCallbacks,
} from "../../../../../model/IListProps";
import IAnything from "../../../../../model/IAnything";
import IRowData from "../../../../../model/IRowData";

import { useConstraint } from "../../../../ConstraintView";

import DisplayMode from "../../../../../model/DisplayMode";

import BodyRow from "./components/BodyRow";
import HeadRow from "./components/HeadRow";

import useScrollManager from "../../../hooks/useScrollManager";
import useElementSize from "../../../../../hooks/useElementSize";
import useConstraintManager from "../../../hooks/useConstraintManager";

import Container from "../../Container";

const PAGINATION_HEIGHT = 52;
const RESIZE_DELAY = 100;

const ROWS_PER_PAGE = [10, 25, 50];

const useStyles = makeStyles()((theme, _, classes) => ({
  root: {
    position: "relative",
  },
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    background: theme.palette.background.paper,
    [`& .${classes["noBorder"]}`]: {
      paddingLeft: "0 !important",
      paddingRight: "0 !important",
    },
  },
  noBorder: {
    border: "none !important",
  },
  tableHead: {
    position: "sticky",
    top: -1,
    zIndex: 5,
    background: theme.palette.background.paper,
  },
}));

interface IGridViewProps<
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
 * Represents a GridView component.
 *
 * @template FilterData - The type of the filter data.
 * @template RowData - The type of the row data.
 * @param props - The props for the GridView component.
 * @returns - The rendered GridView.
 */
export const GridView = <
  FilterData extends {} = IAnything,
  RowData extends IRowData = IAnything
>(
  props: IGridViewProps<FilterData, RowData>
) => {
  const { classes } = useStyles();

  const scrollManager = useScrollManager();

  const { constraintManager } = useConstraintManager();

  const { elementRef, size } = useElementSize({
    debounce: RESIZE_DELAY,
  });

  const { height, width } = size;

  const { isTablet, isDesktop } = useConstraint(width);

  const {
    limit,
    offset,
    rows,
    loading,
    total,
    labelDisplayedRows,
    columns = [],
    withLoader = false,
    withInitialLoader = false,
  } = props;

  const { handleLimitChange, handlePageChange } = props;

  /**
   * Function that handles window resize event.
   * Clears the constraint manager.
   *
   * @function handleResize
   * @returns
   */
  const handleResize = () => constraintManager.clear();

  /**
   * Handles the change event for the dirty limit input field.
   *
   * @param e - The event object.
   * @returns
   */
  const handleDirtyLimitChange = (e: any) => handleLimitChange(e.target.value);

  /**
   * Handles a change in the dirty page state.
   *
   * @param _ - Placeholder parameter, not used in the implementation.
   * @param newPage - The new page number.
   * @returns
   */
  const handleDirtyPageChange = (_: any, newPage: number) =>
    handlePageChange(newPage);

  /**
   * Renders a placeholder cell with loading indicator and text.
   *
   * @param width - The width of the placeholder cell.
   *
   * @returns - The rendered placeholder cell.
   */
  const renderPlaceholder = (width: number) => (
    <TableCell
      className={classes.noBorder}
      sx={{ position: "relative" }}
      colSpan={columns.length * 2 || 999}
      align="center"
    >
      <Stack
        sx={{
          position: "sticky",
          top: 0,
          left: 0,
          width,
        }}
        direction="row"
        alignItems="center"
        justifyContent="center"
        gap={1}
      >
        {loading && <CircularProgress size={24} />}
        <Typography variant="body1">
          {loading ? "Loading" : "Nothing found"}
        </Typography>
      </Stack>
    </TableCell>
  );

  useEffect(
    () => () => {
      scrollManager.clear();
    },
    []
  );

  /**
   * Renders the inner content of a table based on the specified display mode.
   *
   * @param mode - The display mode of the table.
   * @returns - The inner content of the table.
   */
  const renderInner = (mode: DisplayMode) => (
    <>
      <TableHead className={classes.tableHead}>
        <HeadRow fullWidth={width} mode={mode} />
      </TableHead>
      <TableBody>
        {(withLoader && loading) ||
        (withInitialLoader && loading && rows.length === 0) ||
        (!loading && rows.length === 0) ? (
          <TableRow>{renderPlaceholder(width)}</TableRow>
        ) : (
          rows.map((row, index) => (
            <Fragment key={`${row.id}-${index}`}>
              <BodyRow fullWidth={width} row={row} mode={mode} />
            </Fragment>
          ))
        )}
      </TableBody>
    </>
  );

  /**
   * Renders the child element based on the current display mode.
   * If the display mode is desktop, the child element is rendered with DisplayMode.Desktop.
   * If the display mode is tablet, the child element is rendered with DisplayMode.Tablet.
   * If the display mode is phone or any other mode, the child element is rendered with DisplayMode.Phone.
   *
   * @returns - The rendered child element
   */
  const renderChild = () => {
    if (isDesktop) {
      return renderInner(DisplayMode.Desktop);
    }
    if (isTablet) {
      return renderInner(DisplayMode.Tablet);
    }
    return renderInner(DisplayMode.Phone);
  }

  return (
    <Container<FilterData, RowData> {...props} onResize={handleResize}>
      <Box ref={elementRef} className={classes.root}>
        <Box className={classes.container}>
          <TableContainer
            ref={scrollManager.provideRef}
            style={{ height: height - PAGINATION_HEIGHT, width }}
          >
            <Table stickyHeader>
              {renderChild()}
            </Table>
          </TableContainer>
          <TablePagination
            width={width}
            height={height}
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

export default GridView;
