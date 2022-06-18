import * as React from 'react';
import { useState, createElement } from 'react';

import { makeStyles } from '../../../../../../styles';

import MatListItem from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';

import Async from '../../../../../Async';
import ActionMenu from '../../../../../ActionMenu';

import IListProps from '../../../../../../model/IListProps';
import IAnything from '../../../../../../model/IAnything';
import IRowData from '../../../../../../model/IRowData';
import IColumn from "../../../../../../model/IColumn";

import useProps from '../.../../../../../hooks/useProps';
import useSelection from '../../../../hooks/useSelection';

import RowCheckbox from './common/RowCheckbox';
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
        rowMark,
        fallback,
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
            disableRipple={menuOpened}
        >
            {!!rowMark && (
                <RowMark
                    row={row}
                />
            )}
            <ListItemIcon>
                <RowCheckbox
                    row={row}
                />
            </ListItemIcon>
            <ListItemText
                primary={primary}
                secondary={secondary}
            />
            {!!rowActions && (
                <ActionMenu
                    transparent
                    options={rowActions.map(({
                        isDisabled = () => false,
                        isVisible = () => true,
                        ...other
                    }) => ({
                        ...other,
                        isVisible: () => isVisible(row),
                        isDisabled: () => isDisabled(row),
                    }))}
                    onToggle={handleMenuToggle}
                    onAction={handleAction}
                    fallback={fallback}
                />
            )}
        </MatListItem>
    );
};

export default ListItem;
