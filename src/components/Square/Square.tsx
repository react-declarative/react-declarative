import * as React from 'react';

import { makeStyles } from "../../styles";

import Box, { BoxProps } from '@mui/material/Box';
import classNames from '../../utils/classNames';

/**
 * Represents the props for a Square component.
 */
interface ISquareProps extends BoxProps {
    children: React.ReactNode;
}

const useStyles = makeStyles()({
    root: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        width: '100%',
    },
    container: {
        position: 'relative',
        paddingBottom: '100%',
        width: '100%',
        height: 0,
    },
    content: {
        position: 'absolute',
        height: '100%',
        width: '100%',
        display: 'flex',
        alignItems: 'stretch',
        justifyContent: 'stretch',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        '& > *:nth-of-type(1)': {
            flex: 1,
        },
    },
});

/**
 * Square component.
 *
 * @typedef Square
 * @param className - The class name to apply to the Square component.
 * @param children - The content to render inside the Square component.
 * @param otherProps - Additional props to be spread onto the Square component.
 * @returns - The rendered Square component.
 */
export const Square = ({
    className,
    children,
    ...otherProps
}: ISquareProps) => {
    const { classes } = useStyles();
    return (
        <Box
            className={classNames(className, classes.root)}
            {...otherProps}
        >
            <div className={classes.container}>
                <div className={classes.content}>
                    {children}
                </div>
            </div>
        </Box>
    );
}

export default Square;
