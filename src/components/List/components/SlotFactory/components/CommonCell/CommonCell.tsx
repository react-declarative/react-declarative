import * as React from 'react';
import { Fragment } from 'react';

import { makeStyles } from '../../../../../../styles';

import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';

import Async from '../../../../../Async';
import ActionMenu from '../../../../../common/ActionMenu';

import IAnything from '../../../../../../model/IAnything';
import IRowData from '../../../../../../model/IRowData';
import ColumnType from '../../../../../../model/ColumnType';

import { ICommonCellSlot } from '../../../../slots/CommonCellSlot';

import useProps from "../../../../hooks/useProps";

const useStyles = makeStyles({
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

export const CommonCell = <RowData extends IRowData = IAnything>({
    column,
    row,
    onMenuToggle,
    onAction,
}: ICommonCellSlot<RowData>) => {

    const classes = useStyles();

    const {
        fallback,
        rowActions = [],
    } = useProps<RowData>()
    
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
        return (
            <ActionMenu
                transparent
                options={rowActions.map(({
                    isVisible = () => true,
                    isDisabled = () => false,
                    ...other
                }) => ({
                    ...other,
                    isVisible: () => isVisible(row),
                    isDisabled: () => isDisabled(row),
                }))}
                onToggle={onMenuToggle}
                onAction={onAction}
                fallback={fallback}
            />
        );
    } else {
        return null;
    }

};

export default CommonCell;
