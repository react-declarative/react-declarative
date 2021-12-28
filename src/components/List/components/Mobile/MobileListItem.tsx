import * as React from 'react';
import { useState } from 'react';

import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';

import Avatar from '@material-ui/core/Avatar';

import Async from '../../../common/Async';
import ActionMenu from '../../../common/ActionMenu';

import IListProps from '../../../../model/IListProps';
import IAnything from '../../../../model/IAnything';
import IRowData from '../../../../model/IRowData';
import IColumn from "../../../../model/IColumn";

import { useProps } from '../PropProvider';

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

interface IMobileListItemProps<RowData extends IRowData = IAnything> {
    row: RowData;
    style?: React.CSSProperties;
}

export const MobileListItem = <RowData extends IRowData = IAnything>({
    row,
    style,
}: IMobileListItemProps<RowData>) => {

    const [menuOpened, setMenuOpened] = useState(false);

    const {
        columns = [],
        fallback,
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
            debugger
        }
    };

    const handleMenuToggle = (opened: boolean) => setMenuOpened(opened);

    return (
        <ListItem
            button
            onClick={handleClick}
            style={style}
        >
            <ListItemAvatar>
                <Avatar />
            </ListItemAvatar>
            <ListItemText
                primary={primary}
                secondary={secondary}
            />
            <ActionMenu
                transparent
                onToggle={handleMenuToggle}
            />
        </ListItem>
    );
};

export default MobileListItem;
