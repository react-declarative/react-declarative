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
    zIndex: 1,
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
        payload: never;
      }
    >,
    IListState<FilterData, RowData>,
    IListCallbacks<FilterData, RowData> {
  className?: string;
  style?: React.CSSProperties;
  listChips: IListProps["chips"];
}

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
    delay: RESIZE_DELAY,
  });

  const { height, width } = size;

  const { isTablet, isDesktop } = useConstraint(width);

  const {
    limit,
    offset,
    rows,
    loading,
    total,
    columns = [],
    withLoader = false,
    withInitialLoader = false,
  } = props;

  const { handleLimitChange, handlePageChange } = props;

  const handleResize = () => constraintManager.clear();

  const handleDirtyLimitChange = (e: any) => handleLimitChange(e.target.value);

  const handleDirtyPageChange = (_: any, newPage: number) =>
    handlePageChange(newPage);

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
            <Fragment key={index}>
              <BodyRow fullWidth={width} row={row} mode={mode} />
            </Fragment>
          ))
        )}
      </TableBody>
    </>
  );

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
