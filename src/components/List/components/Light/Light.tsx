import * as React from "react";

import { makeStyles } from '../../../../styles';

import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableFooter from '@mui/material/TableFooter';
import TableHead from '@mui/material/TableHead';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

import IListProps, { IListState, IListCallbacks } from '../../../../model/IListProps';
import IAnything from '../../../../model/IAnything';
import IRowData from '../../../../model/IRowData';

import LightBodyRow from "./components/LightBodyRow";
import LightHeadRow from "./components/LightHeadRow";

import Container from "../Container";

import { SelectionProvider } from './hooks/useSelection';
import { SortModelProvider } from './hooks/useSortModel';

const PAGINATION_HEIGHT = 52;

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'relative',
    background: theme.palette.background.paper,
  },
  tableHead: {
    position: 'sticky',
    top: 0,
  },
  tableBody: {
    marginTop: 53,
  },
}));

interface ILightProps<FilterData = IAnything, RowData extends IRowData = IAnything> extends
  Omit<IListProps<FilterData, RowData>, keyof {
    ref: never;
    limit: never;
    autoReload: never;
  }>,
  IListState<FilterData, RowData>,
  IListCallbacks<FilterData, RowData> {
  className?: string;
  style?: React.CSSProperties;
}

export const Light = <
  FilterData extends IAnything = IAnything,
  RowData extends IRowData = IAnything,
  >(props: ILightProps<FilterData, RowData>) => {

  const classes = useStyles();

  const {
    limit,
    offset,
    loading,
    total,
    columns = [],
  } = props;

  const {
    handleLimitChange,
    handlePageChange,
  } = props;

  const handleDirtyLimitChange = (e: any) => handleLimitChange(e.target.value);

  const handleDirtyPageChange = (_: any, newPage: number) => handlePageChange(newPage);

  const renderPlaceholder = () => (
    <TableCell rowSpan={columns.length || 1} align="center">
      {loading ? "Loading" : "Nothing found"}
    </TableCell>
  );

  return (
    <SelectionProvider>
      <SortModelProvider>
        <Container<FilterData, RowData>
          {...props}
        >
          {({ height, width, payload: { rows } }) => (
            <Box className={classes.root}>
              <TableContainer style={{ height: height - PAGINATION_HEIGHT, width }}>
                <Table stickyHeader>
                  <TableHead>
                    <LightHeadRow<RowData> />
                  </TableHead>
                  <TableBody>
                    {rows.map((row, index) => (
                      <LightBodyRow<RowData>
                        row={row}
                        key={index}
                      />
                    ))}
                    {rows.length === 0 && (
                      <TableRow>
                        {renderPlaceholder()}
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <TableContainer style={{ height: PAGINATION_HEIGHT, width }}>
                <Table>
                  <TableFooter>
                    <TablePagination
                      count={total || -1}
                      rowsPerPage={limit}
                      page={offset / limit}
                      onPageChange={handleDirtyPageChange}
                      onRowsPerPageChange={handleDirtyLimitChange}
                    />
                  </TableFooter>
                </Table>
              </TableContainer>
            </Box>
          )}
        </Container>
      </SortModelProvider>
    </SelectionProvider>
  );
};

export default Light;
