import * as React from 'react';

import { makeStyles } from '../../../../styles';

import MatTablePagination, { TablePaginationProps } from '@mui/material/TablePagination';
import Box, { BoxProps } from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import useSelection from '../../hooks/useSelection';

import classNames from '../../../../utils/classNames';

const useStyles = makeStyles({
    root: {
        display: 'flex',
        alignItems: 'center',
    },
    label: {
        flex: 1,
        margin: 0,
        padding: 0,
        paddingLeft: 15,
        whiteSpace: 'nowrap',
    },
});

const TablePaginationContainer = (props: BoxProps) => {
    const classes = useStyles();
    const { selection } = useSelection();
    return (
        <Box
            {...props}
            className={classNames(props.className, classes.root)}
        >   
            {selection.size ? (
                <Typography
                    variant="body1"
                    className={classes.label}
                >
                    {`Selected: ${selection.size} items`}
                </Typography>
            ) : (
                <Box flex="1" />
            )}
            {props.children}
        </Box>
    );
};

export const TablePagination = (props: TablePaginationProps) => (
    <MatTablePagination
        {...props}
        component={TablePaginationContainer}
    />
);

export default TablePagination;
