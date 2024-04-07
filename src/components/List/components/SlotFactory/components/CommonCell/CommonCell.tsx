import * as React from 'react';
import { Fragment, createElement } from 'react';

import { makeStyles } from '../../../../../../styles';

import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';

import Async from '../../../../../Async';
import ActionMenu from '../../../../../ActionMenu';

import IAnything from '../../../../../../model/IAnything';
import IRowData from '../../../../../../model/IRowData';
import ColumnType from '../../../../../../model/ColumnType';

import { ICommonCellSlot } from '../../../../slots/CommonCellSlot';

import useProps from "../../../../hooks/useProps";
import usePayload from '../../../../hooks/usePayload';
import useActualValue from '../../../../../../hooks/useActualValue';

const LOAD_SOURCE = 'list-item';

/**
 * Returns the styles object for a given component.
 *
 * @returns The styles object.
 */
const useStyles = makeStyles()({
    stretch: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        height: '100%',
        width: '100%',
        display: 'flex',
        alignItems: 'stretch',
        justifyContent: 'stretch',
        '& > *:nth-of-type(1)': {
            flex: 1,
        },
    },
});

/**
 * Represents a common cell component that renders different types of columns in a table.
 * @template RowData The data type of the row.
 * @param props - The props for the CommonCell component.
 */
export const CommonCell = <RowData extends IRowData = IAnything>({
    column,
    row,
    disabled,
    onMenuToggle,
    onAction,
}: ICommonCellSlot<RowData>) => {

    const { classes } = useStyles();
    const _payload = usePayload();

    const row$ = useActualValue(row);

    const {
        fallback,
        rowActions = [],
        onLoadStart,
        onLoadEnd,
        loading,
    } = useProps<RowData>();

    /**
     * Invokes the `onLoadStart` function, if provided, with the `LOAD_SOURCE`.
     *
     * @function handleLoadStart
     * @returns
     */
    const handleLoadStart = () => onLoadStart && onLoadStart(LOAD_SOURCE);
    
    /**
     * A function for handling the load end event.
     *
     * @param isOk - A boolean value indicating the success of the load operation.
     * @returns
     */
    const handleLoadEnd = (isOk: boolean) => onLoadEnd && onLoadEnd(isOk, LOAD_SOURCE);

    if (column.type === ColumnType.Text) {
        return row[column.field!];
    } else if (column.type === ColumnType.Compute) {
        return (
            <Async
                payload={row}
                deps={[_payload]}
                fallback={fallback}
                onLoadStart={handleLoadStart}
                onLoadEnd={handleLoadEnd}
                throwError
            >
                {async (row) => {
                    const data = { ...row, _payload };
                    if (column.element) {
                        return createElement(column.element, data);
                    } else if (column.compute) {
                        return await column.compute(data, _payload);
                    } else {
                        return null;
                    }
                }}
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
                <Element {...{...row, _payload}} />
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
                    /**
                     * Determines whether the specified row is visible.
                     *
                     * @param row$ - The row object.
                     * @param _payload - Optional payload object.
                     * @returns - True if the row is visible, false otherwise.
                     */
                    isVisible: () => isVisible(row$.current, _payload),
                    /**
                     * Check if the given row is disabled based on provided payload.
                     *
                     * @param row - The current row object.
                     * @param payload - The payload object used for checking if row is disabled.
                     * @returns - True if the row is disabled, false otherwise.
                     */
                    isDisabled: () => isDisabled(row$.current, _payload),
                }))}
                onToggle={onMenuToggle}
                onAction={onAction}
                fallback={fallback}
                payload={row}
                deps={[_payload]}
                onLoadStart={handleLoadStart}
                onLoadEnd={handleLoadEnd}
                disabled={loading || disabled}
                throwError
            />
        );
    } else {
        return null;
    }

};

export default CommonCell;
