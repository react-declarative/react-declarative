import * as React from 'react';

import { makeStyles } from '../../styles';

import Box, { BoxProps } from '@mui/material/Box';

import classNames from '../../utils/classNames';

interface IDotProps extends BoxProps {
    side: number;
    color: string;
}

const useStyles = makeStyles()({
    root: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    container: {
        position: 'relative',
    }, 
    content: {
        position: 'absolute',
        top: 0,
        left: 0,
        transform: 'translate(-50%, -50%)',
        borderRadius: '50%',
    },
});

export const Dot = ({
    className,
    color: background,
    side,
    ...otherProps
}: IDotProps) => {
    const { classes } = useStyles();
    return (
        <Box
            className={classNames(className, classes.root)}
            {...otherProps}
        >
            <div className={classes.container}>
                <Box
                    className={classes.content}
                    sx={{
                        background,
                        height: side,
                        width: side,
                    }}
                />
            </div>
        </Box>
    );
};

export default Dot;
