import * as React from 'react';

import { makeStyles } from '../../../../styles';

import Box, { BoxProps } from '@mui/material/Box';

import classNames from '../../../../utils/classNames';

const ONE_CONTAINER_MARK = "react-declarative__oneContainer";

interface IContainerProps extends BoxProps {
    className?: string;
    children: React.ReactNode;
}

const useStyles = makeStyles()({
    root: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        width: '100%',
    },
    adjust: {
        flex: 1,
    },
});

export const Container = ({
    className,
    children,
    ...otherProps
}: IContainerProps) => {
    const { classes } = useStyles();
    return (
        <Box 
            className={classNames(ONE_CONTAINER_MARK, className, classes.root)}
            {...otherProps}
        >
            {children}
            <div className={classes.adjust} />
        </Box>
    );
};

export default Container;
