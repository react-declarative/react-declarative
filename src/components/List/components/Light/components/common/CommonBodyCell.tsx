import * as React from 'react';
import { Fragment } from 'react';

import { makeStyles } from '../../../../../../styles';

import TableCell from '@mui/material/TableCell';
import Checkbox from '@mui/material/Checkbox';

import Async from '../../../../../common/Async';
import ActionMenu, { IActionMenuProps } from '../../../../../common/ActionMenu';

import IAnything from '../../../../../../model/IAnything';
import IColumn from '../../../../../../model/IColumn';
import IRowData from '../../../../../../model/IRowData';
import ColumnType from '../../../../../../model/ColumnType';

import { useProps } from '../../../PropProvider';

interface ICommonBodyCellProps<RowData extends IRowData = IAnything> {
    column: IColumn<RowData>;
    row: RowData;
    onMenuToggle: IActionMenuProps['onToggle'];
    onAction: IActionMenuProps['onAction']
}

const useStyles = makeStyles({
    root: {
        position: 'relative',
    },
});

export const CommonBodyCell = <RowData extends IRowData = IAnything>({
    column,
    row,
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
                <Element {...row} />
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

    return (
        <TableCell className={classes.root} align={align} padding={padding}>
            {renderInner()}
        </TableCell>
    );

};

export default CommonBodyCell;
