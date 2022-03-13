import * as React from 'react';
import { useState } from 'react';

import { makeStyles } from '../../../../../styles';

import MatListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemAvatar from '@mui/material/ListItemAvatar';

import CheckBoxOutlineBlank from '@mui/icons-material/CheckBoxOutlineBlank';

import Async from '../../../../common/Async';
import ActionMenu from '../../../../common/ActionMenu';

import IListProps from '../../../../../model/IListProps';
import IAnything from '../../../../../model/IAnything';
import IRowData from '../../../../../model/IRowData';
import IColumn from "../../../../../model/IColumn";

import { useProps } from '../../PropProvider';
import RowAvatar from './common/RowAvatar';
import RowMark from './common/RowMark';

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
    style?: React.CSSProperties;
}

export const ListItem = <RowData extends IRowData = IAnything>({
    row,
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
                    row={row}
                />
            )}
            {!!rowAvatar && (
                <ListItemAvatar>
                    <RowAvatar
                        row={row}
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
