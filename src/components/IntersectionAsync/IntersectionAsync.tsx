import * as React from 'react';

import Async, { IAsyncProps } from '../Async';
import Box from '@mui/material/Box';

import { makeStyles } from '../../styles';

import useIntersection from '../../hooks/useIntersection';

import classNames from '../../utils/classNames';

import { SxProps } from '@mui/material';

const useStyles = makeStyles()({
    root: {
        display: 'flex',
        flexDirection: 'column',
    },
});

interface IIntersectionAsyncProps<T extends any = object> extends IAsyncProps<T> {
    className?: string;
    style?: React.CSSProperties;
    sx?: SxProps;
}

export const IntersectionAsync = <T extends any = object>({ 
    className,
    style,
    sx,
    children,
    deps = [],
    ...asyncProps
}: IIntersectionAsyncProps<T>) => {
    const { elementRef, isVisible } = useIntersection();
    
    const { classes } = useStyles();

    return (
        <Box
            ref={elementRef}
            className={classNames(className, classes.root)}
            style={style}
            sx={sx}
        >
            <Async deps={[...deps, isVisible]} {...asyncProps}>
                {async (payload) => {
                    if (!isVisible) {
                        return;
                    }
                    return await children(payload);
                }}
            </Async>
        </Box>
    );
};

export default IntersectionAsync;
