import * as React from 'react';

import { makeStyles } from '../../../../../../styles';

import TableCell from '@mui/material/TableCell';

import CheckboxCellSlot, { ICheckboxCellSlot } from '../../../../slots/CheckboxCellSlot';

/**
 * Represents a function that returns a CSS-in-JS hook for creating styles.
 *
 * @function
 * @return {Function} A function that takes an object representing CSS properties and returns the corresponding style object.
 */
const useStyles = makeStyles()({
    root: {
        position: 'relative',
    },
});

/**
 * A functional component that represents a checkbox body cell in a desktop view.
 *
 * @param props - The props object containing necessary data.
 * @returns - The rendered checkbox body cell.
 */
export const DesktopCheckboxBodyCell = (props: ICheckboxCellSlot) => {
    const { classes } = useStyles();
    return (
        <TableCell className={classes.root} padding="checkbox">
            <CheckboxCellSlot {...props} />
        </TableCell>
    );
};

export default DesktopCheckboxBodyCell;
