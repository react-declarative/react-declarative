import * as React from 'react';
import { Fragment } from 'react';

import { makeStyles } from '../../../../../../styles';

import TableCell from '@mui/material/TableCell';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';

import Async from '../../../../../common/Async';
import ActionMenu, { IActionMenuProps } from '../../../../../common/ActionMenu';

import IAnything from '../../../../../../model/IAnything';
import IColumn from '../../../../../../model/IColumn';
import IRowData from '../../../../../../model/IRowData';
import ColumnType from '../../../../../../model/ColumnType';

import useProps from "../../../../hooks/useProps";

interface ICommonBodyCellProps<RowData extends IRowData = IAnything> {
    column: IColumn<RowData>;
    row: RowData;
    fullWidth: number;
    onMenuToggle: IActionMenuProps['onToggle'];
    onAction: IActionMenuProps['onAction']
}

const useStyles = makeStyles({
    root: {
        position: 'relative',
        overflow: 'hidden',
        overflowWrap: 'break-word',
    },
    stretch: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'stretch',
        justifyContent: 'stretch',
        '& > *:nth-child(1)': {
            flex: 1,
        },
    },
});

export const CommonBodyCell = <RowData extends IRowData = IAnything>({
    column,
    row,
    fullWidth,
    onMenuToggle,
    onAction,
}: ICommonBodyCellProps<RowData>) => {

    const classes = useStyles();

    const {
        fallback,
        rowActions,
    } = useProps<RowData>()
    
    const renderInner = () => {
        if (column.type === ColumnType.Text) {
            return row[column.field!];
        } else if (column.type === ColumnType.Compute) {
            return (
                <Async
                    payload={row}
                    fallback={fallback}
                >
                    {column.compute!}
                </Async>
            );
        } else if (column.type === ColumnType.CheckBox) {
            return (
                <Checkbox
                    color="primary"
                    disabled
                    checked={row[column.field!]}
                />
            );
        } else if (column.type === ColumnType.Component) {
            const {
                element: Element = () => <Fragment />,
            } = column;
            return (
                <Box className={classes.stretch}>
                    <Element {...row} />
                </Box>
            );
        } else if (column.type === ColumnType.Action) {
            return !!rowActions ? (
                <ActionMenu
                    transparent
                    options={rowActions}
                    onToggle={onMenuToggle}
                    onAction={onAction}
                />
            ) : null;
        } else {
            return null;
        }
    };

    const padding = column.type === ColumnType.Component ? 'none'
        : column.type === ColumnType.CheckBox ? 'checkbox'
        : 'normal';

    const align = column.type === ColumnType.Action ? 'center' : 'left';

    const minWidth = typeof column.width === 'function' ? column.width(fullWidth) : column.width;
    const maxWidth = minWidth;

    return (
        <TableCell
            className={classes.root}
            style={{ minWidth, maxWidth }}
            align={align}
            padding={padding}
        >
            {renderInner()}
        </TableCell>
    );

};

export default CommonBodyCell;
