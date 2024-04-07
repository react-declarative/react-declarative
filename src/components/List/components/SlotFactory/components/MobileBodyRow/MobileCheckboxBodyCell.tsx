import * as React from 'react';

import { makeStyles } from '../../../../../../styles';

import TableCell from '@mui/material/TableCell';

import CheckboxCellSlot, { ICheckboxCellSlot } from '../../../../slots/CheckboxCellSlot';

/**
 * A function that generates styles using the `makeStyles` method.
 *
 * @function
 * @name useStyles
 * @returns - The generated styles object.
 *
 */
const useStyles = makeStyles()({
    root: {
        position: 'relative',
        width: 48,
        maxWidth: 48,
    },
});

/**
 * Represents a mobile checkbox body cell component.
 * @param props - The properties for the component.
 * @returns The mobile checkbox body cell component.
 */
export const MobileCheckboxBodyCell = (props: ICheckboxCellSlot) => {
    const { classes } = useStyles();
    return (
        <TableCell className={classes.root} padding="checkbox">
            <CheckboxCellSlot {...props} />
        </TableCell>
    );
};

export default MobileCheckboxBodyCell;
