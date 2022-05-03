import * as React from 'react';
import { useState, createElement } from 'react';

import { makeStyles } from '../../../../../../styles';

import MatListItem from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemAvatar from '@mui/material/ListItemAvatar';

import Async from '../../../../../Async';
import ActionMenu from '../../../../../common/ActionMenu';

import IListProps from '../../../../../../model/IListProps';
import IAnything from '../../../../../../model/IAnything';
import IRowData from '../../../../../../model/IRowData';
import IColumn from "../../../../../../model/IColumn";

import useProps from '../.../../../../../hooks/useProps';
import useSelection from '../../../../hooks/useSelection';

import RowCheckbox from './common/RowCheckbox';
import RowAvatar from './common/RowAvatar';
import RowMark from './common/RowMark';

const ColumnContent = <RowData extends IRowData = IAnything>({
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
            if (column && column.element) {
                return createElement(column.element, row);
            } else  if (column && column.compute) {
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

interface IChooserListItemProps<RowData extends IRowData = IAnything> {
    row: RowData;
    style?: React.CSSProperties;
}

export const ListItem = <RowData extends IRowData = IAnything>({
    row,
    style,
}: IChooserListItemProps<RowData>) => {

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

    const { selection } = useSelection();

    const primaryColumn = columns.find(({ primary }) => primary) || columns.find(({ field }) => !!field);
    const secondaryColumn = columns.find(({ secondary }) => secondary);

    const primary = (
        <ColumnContent<RowData>
            row={row}
            fallback={fallback}
            column={primaryColumn}
        />
    );

    const secondary = secondaryColumn ? (
        <ColumnContent<RowData>
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
            selected={selection.has(row.id)}
            className={classes.root}
            onClick={handleClick}
            style={style}
        >
            {!!rowMark && (
                <RowMark
                    row={row}
                />
            )}
            {!!rowAvatar ? (
                <ListItemAvatar>
                    <RowAvatar
                        row={row}
                    />
                </ListItemAvatar>
            ) : (
                <ListItemIcon>
                    <RowCheckbox
                        row={row}
                    />
                </ListItemIcon>
            )}
            <ListItemText
                primary={primary}
                secondary={secondary}
            />
            {!!rowActions && (
                <ActionMenu
                    transparent
                    options={rowActions.filter(({ isVisible = () => true }) => isVisible(row))}
                    onToggle={handleMenuToggle}
                    onAction={handleAction}
                />
            )}
        </MatListItem>
    );
};

export default ListItem;
