import * as React from 'react';

import { makeStyles } from '../../styles';

import Box, { BoxProps } from '@mui/material/Box';

import classNames from '../../utils/classNames';

/**
 * Represents the properties for the Center component.
 *
 * @interface ICenterProps
 */
interface ICenterProps extends BoxProps {
}

/**
 * Returns the classes object generated by the makeStyles function.
 *
 * @function
 * @returns - The classes object containing the generated CSS classes.
 */
const useStyles = makeStyles()({
    root: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

/**
 * A functional component that renders a Box component with given className and otherProps.
 *
 * @param props - The properties to configure the Center component.
 * @param props.className - The className for the Box component.
 * @param props.otherProps - The other properties to be spread onto the Box component.
 *
 * @returns The rendered Center component.
 */
export const Center = ({
    className,
    ...otherProps
}: ICenterProps) => {
    const { classes } = useStyles();
    return (
        <Box
            className={classNames(className, classes.root)}
            {...otherProps}
        />
    );
}

export default Center;
