import * as React from 'react';

import { makeStyles } from "../../styles";

import Box, { BoxProps } from '@mui/material/Box';
import classNames from '../../utils/classNames';

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
        '& > *:nth-child(1)': {
            flex: 1,
        },
    },
});

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
