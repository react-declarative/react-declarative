import * as React from "react";
import { useRef, Fragment } from 'react';

import { makeStyles } from '../../../../../styles';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';

import IListProps, { IListState, IListCallbacks } from '../../../../../model/IListProps';
import IAnything from '../../../../../model/IAnything';
import IRowData from '../../../../../model/IRowData';

import ConstraintView from "../../../../ConstraintView";

import DisplayMode from "../../../../../model/DisplayMode";

import ExpansionRow from "./components/ExpansionRow";
import BodyRow from "./components/BodyRow";
import HeadRow from "./components/HeadRow";

import constraintManager from "./helpers/constraintManager";

import Container from "../../Container";

const PAGINATION_HEIGHT = 52;

const ROWS_PER_PAGE = [10, 25, 50];

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'relative',
    background: theme.palette.background.paper,
    '& .MuiTableCell-root': {
      paddingLeft: '0 !important',
      paddingRight: '0 !important',
    },
  },
  noBorder: {
    border: 'none !important',
  },
}));

interface IGridViewProps<FilterData = IAnything, RowData extends IRowData = IAnything> extends
  Omit<IListProps<FilterData, RowData>, keyof {
    ref: never;
    limit: never;
    chips: never;
    isChooser: never;
    autoReload: never;
  }>,
  IListState<FilterData, RowData>,
  IListCallbacks<FilterData, RowData> {
  className?: string;
  style?: React.CSSProperties;
  listChips: IListProps['chips'];
}

export const GridView = <
  FilterData extends IAnything = IAnything,
  RowData extends IRowData = IAnything,
  >(props: IGridViewProps<FilterData, RowData>) => {

  const classes = useStyles();

  const outerRef = useRef<HTMLDivElement>(null);

  const {
    limit,
    offset,
    loading,
    total,
    columns = [],
    showLoader,
  } = props;

  const {
    handleLimitChange,
    handlePageChange,
  } = props;

  const handleResize = () => constraintManager.clear();

  const handleDirtyLimitChange = (e: any) => handleLimitChange(e.target.value);

  const handleDirtyPageChange = (_: any, newPage: number) => handlePageChange(newPage);

  const handleScrollTop = () => outerRef.current && outerRef.current.scrollTo(outerRef.current.scrollLeft || 0, 0);

  const renderPlaceholder = () => (
    <TableCell className={classes.noBorder} colSpan={columns.length + 1 || 1} align="center">
      <Stack direction="row" alignItems="center" justifyContent="center" gap={1}>
        {loading && <CircularProgress size={28} />}
        <Typography variant="body1">
          {loading ? "Loading" : "Nothing found"}
        </Typography>
      </Stack>
    </TableCell>
  );

  return (
    <Container<FilterData, RowData>
      {...props}
      onResize={handleResize}
    >
      {(params) => {

        const { height, width, payload: { rows } } = params;

        const renderInner = (mode: DisplayMode) => (
          <Box className={classes.root}>
            <TableContainer ref={outerRef} style={{ height: height - PAGINATION_HEIGHT, width }}>
              <Table stickyHeader>
                <TableHead>
                  <HeadRow
                    onSortModelChange={handleScrollTop}
                    fullWidth={width}
                    mode={mode}
                  />
                </TableHead>
                <TableBody>
                  {(showLoader && loading) || (!loading && rows.length === 0) ? (
                    <TableRow>
                      {renderPlaceholder()}
                    </TableRow>
                  ) : rows.map((row, index) => (
                    <Fragment key={index}>
                      <BodyRow<RowData>
                        fullWidth={width}
                        row={row}
                        mode={mode}
                      />
                      <ExpansionRow<RowData>
                        row={row}
                        mode={mode}
                      />
                    </Fragment>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              width={width}
              component={Box}
              count={total || -1}
              rowsPerPage={limit}
              page={offset / limit}
              rowsPerPageOptions={ROWS_PER_PAGE}
              onPageChange={handleDirtyPageChange}
              onRowsPerPageChange={handleDirtyLimitChange}
            />
          </Box>
        );

        return (
          <ConstraintView
            phoneView={() => renderInner(DisplayMode.Phone)}
            tabletView={() => renderInner(DisplayMode.Tablet)}
            desktopView={() => renderInner(DisplayMode.Desktop)}
            onViewChanged={handleResize}
            params={params}
          />
        );
      }}
    </Container>
  );
};

export default GridView;
