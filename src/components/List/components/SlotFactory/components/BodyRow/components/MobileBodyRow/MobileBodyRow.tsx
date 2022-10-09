import * as React from 'react';
import { useMemo, useState } from 'react';

import { makeStyles } from '../../../../../../../../styles';
import { alpha } from '@mui/material';

import TableRow from '@mui/material/TableRow';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';

import CheckboxBodyCell from './MobileCheckboxBodyCell';
import CommonBodyCell from './MobileCommonCell';

import IRowData from '../../../../../../../../model/IRowData';
import IAnything from '../../../../../../../../model/IAnything';

import ColumnType from '../../../../../../../../model/ColumnType';

import { IBodyRowSlot, BodyColumn } from '../../../../../../slots/BodyRowSlot';

import useProps from '../../../../../../hooks/useProps';
import useSelection from '../../../../../../hooks/useSelection';
import useReload from '../../../../../../hooks/useReload';

const useStyles = makeStyles()((theme) => ({
    root: {
        '&:nth-of-type(2n)': {
            background: alpha(
                theme.palette.getContrastText(theme.palette.background.paper),
                0.04
            ),
        },
        '& .MuiTableCell-root': {
            borderBottom: '0 !important',
        },
    },
    row: {
        marginBottom: 16,
    },
}));

export const DesktopBodyRow = <RowData extends IRowData = IAnything>({
    row,
    mode,
    columns,
    fullWidth,
}: IBodyRowSlot<RowData>) => {

    const [menuOpened, setMenuOpened] = useState(false);
    const { classes } = useStyles();

    const props = useProps<RowData>();
    const reload = useReload();
    
    const { selection } = useSelection();

    const {
        onRowClick,
        onRowAction,
    } = props;

    const handleClick = () => {
        if (!menuOpened) {
            onRowClick && onRowClick(row, reload);
        }
    };

    const handleMenuToggle = (opened: boolean) => {
        setMenuOpened(opened);
    };

    const handleAction = (action: string) => {
        onRowAction && onRowAction(action, row, reload);
    };

    const [firstCol, actionCol, cols] = useMemo(() => {

        const createRenderColumn = (
            colSpan: number,
            prefix: string,
            withLabel: boolean,
            disableGutters: boolean,
        ) => (column: BodyColumn, idx: number) => (
            <CommonBodyCell
                column={column}
                row={row}
                key={`${prefix}-${idx}`}
                idx={idx}
                mode={mode}
                colSpan={colSpan}
                fullWidth={fullWidth}
                onAction={handleAction}
                withLabel={withLabel}
                disableGutters={disableGutters}
                onMenuToggle={handleMenuToggle}
            />
        );

        const commonCols = columns
            .filter(({ type }) => type !== ColumnType.Action)

        const [actionCol = null] = columns
            .filter(({ type }) => type === ColumnType.Action)
            .map(createRenderColumn(1, 'action', false, true));

        const firstCol = commonCols
            .slice(0, 1)
            .map(createRenderColumn(1, 'first', true, true))
            .pop();

        const primaryCol = commonCols
            .filter(({ primary }) => primary)
            .map(createRenderColumn(1, 'primary', true, true))
            .pop();
    
        const cols = (primaryCol ? commonCols : commonCols.slice(1))
            .map(createRenderColumn(actionCol ? 3 : 2, 'col', true, false));

        return [primaryCol || firstCol, actionCol, cols];

    }, [fullWidth]);

    return (
        <TableRow
            className={classes.root}
            selected={selection.has(row.id)}
            onClick={handleClick}
        >
            <TableCell padding="none">
                <Table className={classes.row}>
                    <TableBody>
                        <TableRow>
                            <CheckboxBodyCell row={row} />
                            {firstCol}
                            {actionCol}
                        </TableRow>
                        {cols.map((col, idx) => (
                            <TableRow key={idx}>
                                {col}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableCell>
        </TableRow>
    );
};

export default DesktopBodyRow;
