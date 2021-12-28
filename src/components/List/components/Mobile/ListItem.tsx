import * as React from 'react';
import { useState } from 'react';
import { makeStyles } from '@material-ui/core';

import MatListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';

import CheckBoxOutlineBlank from '@material-ui/icons/CheckBoxOutlineBlank';

import Async from '../../../common/Async';
import ActionMenu from '../../../common/ActionMenu';

import IListProps from '../../../../model/IListProps';
import IAnything from '../../../../model/IAnything';
import IRowData from '../../../../model/IRowData';
import IColumn from "../../../../model/IColumn";

import { useProps } from '../PropProvider';
import RowAvatar from '../RowAvatar';
import RowMark from '../RowMark';

const AsyncText = <RowData extends IRowData = IAnything>({
    row,
    fallback,
    column,
}: {
    row: RowData;
    fallback?: IListProps['fallback'];
    column?: IColumn<RowData>;
}) => (
    <Async fallback={fallback}>
        {() => {
            if (column && column.compute) {
                return column.compute(row);
            } else if (column && column.field) {
                return row[column.field];
            } else {
                return 'empty';
            }
        }}
    </Async>
);

const useStyles = makeStyles({
    root: {
        position: 'relative',
    },
    checkbox: {
        opacity: 0.2,
    },
});

interface IMobileListItemProps<RowData extends IRowData = IAnything> {
    row: RowData;
    rows: RowData[];
    style?: React.CSSProperties;
}

export const ListItem = <RowData extends IRowData = IAnything>({
    row,
    rows,
    style,
}: IMobileListItemProps<RowData>) => {

    const [menuOpened, setMenuOpened] = useState(false);
    const classes = useStyles();

    const {
        columns = [],
        rowActions,
        onRowClick,
        onRowAction,
        fallback,
        rowAvatar,
        rowMark,
    } = useProps();

    const primaryColumn = columns.find(({ primary }) => primary) || columns.find(({ field }) => !!field);
    const secondaryColumn = columns.find(({ secondary }) => secondary);
    const rowId = row.id.toString();

    const primary = (
        <AsyncText<RowData>
            row={row}
            fallback={fallback}
            column={primaryColumn}
        />
    );

    const secondary = secondaryColumn ? (
        <AsyncText<RowData>
            row={row}
            fallback={fallback}
            column={secondaryColumn}
        />
    ) : null;
    
    const handleClick = () => {
        if (!menuOpened) {
            onRowClick && onRowClick(row);
        }
    };

    const handleMenuToggle = (opened: boolean) => {
        setMenuOpened(opened);
    };

    const handleAction = (action: string) => {
        onRowAction && onRowAction(row, action);
    };

    return (
        <MatListItem
            button
            className={classes.root}
            onClick={handleClick}
            style={style}
        >
            {!!rowMark && (
                <RowMark
                    rowId={rowId}
                    rowMark={rowMark}
                    rows={rows}
                />
            )}
            {!!rowAvatar && (
                <ListItemAvatar>
                    <RowAvatar
                        rowAvatar={rowAvatar}
                        rowId={rowId}
                        rows={rows}
                    />
                </ListItemAvatar>
            )}
            {!rowAvatar && (
                <ListItemIcon className={classes.checkbox}>
                    <CheckBoxOutlineBlank />
                </ListItemIcon>
            )}
            <ListItemText
                primary={primary}
                secondary={secondary}
            />
            {!!rowActions && (
                <ActionMenu
                    transparent
                    options={rowActions}
                    onToggle={handleMenuToggle}
                    onAction={handleAction}
                />
            )}
        </MatListItem>
    );
};

export default ListItem;
