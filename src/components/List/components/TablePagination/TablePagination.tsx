import * as React from 'react';

import { makeStyles } from '../../../../styles';

import MatTablePagination from '@mui/material/TablePagination';
import PaginationItem from '@mui/material/PaginationItem';
import Pagination from '@mui/material/Pagination';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import { TablePaginationProps } from '@mui/material/TablePagination';
import { BoxProps } from '@mui/material/Box';

import ArrowBackIcon from '@mui/icons-material/KeyboardArrowLeft';
import ArrowForwardIcon from '@mui/icons-material/KeyboardArrowRight';

import classNames from '../../../../utils/classNames';

import useSelection from '../../hooks/useSelection';
import useProps from '../../hooks/useProps';

const ACTION_GROW = 500;

const useStyles = makeStyles({
    root: {
        display: 'flex',
        alignItems: 'center',
        scrollbarWidth: 'none',
        '&::-webkit-scrollbar': {
            display: 'none',
        },
        '& .MuiTablePagination-selectLabel': {
            display: 'none',
        },
        '& .MuiToolbar-root': {
            paddingLeft: 'unset !important',
        },
        '& .MuiToolbar-root > .MuiInputBase-root': {
            marginRight: 'unset !important',
        },
        '& .MuiTablePagination-displayedRows': {
            transform: 'translateY(-1px)',
            marginLeft: '10px',
            marginRight: '10px',
        },
        '& .MuiTablePagination-actions': {
            marginLeft: 'unset !important',
        },
        '& .MuiToolbar-root > .MuiPagination-root': {
            marginLeft: 'unset !important',
        },
        '& .MuiToolbar-root > .MuiPagination-root > .MuiPagination-ul': {
            flexWrap: 'nowrap',
        },
        overflowX: 'auto',
    },
    label: {
        flex: 1,
        margin: 0,
        padding: 0,
        paddingLeft: 15,
        whiteSpace: 'nowrap',
    },
    disabled: {
        pointerEvents: 'none',
        opacity: 0.5,
    },
});

const TablePaginationContainer = (props: BoxProps) => {
    const classes = useStyles();
    const { selection } = useSelection();
    const { loading } = useProps();
    return (
        <Box
            {...props}
            className={classNames(props.className, classes.root, {
                [classes.disabled]: loading,
            })}
        >   
            {selection.size ? (
                <Typography
                    variant="body1"
                    className={classes.label}
                >
                    {`Selected: ${selection.size} ${selection.size === 1 ? 'item' : 'items'}`}
                </Typography>
            ) : (
                <Box flex="1" />
            )}
            {props.children}
        </Box>
    );
};

const TableActions = ({
    className,
    count,
    page,
    rowsPerPage,
    onPageChange,
}: {
    className?: string;
    rowsPerPage: number;
    count: number;
    page: number;
    onPageChange: (e: any, page: number) => void;
}) => {
    const extraPage = count % rowsPerPage === 0 ? 0 : 1;
    const pages = Math.floor(count / rowsPerPage) + extraPage;
    return (
        <Pagination
            className={className}
            page={page + 1}
            count={pages}
            renderItem={(item) => (
                <PaginationItem
                    components={{
                        previous: ArrowBackIcon,
                        next: ArrowForwardIcon
                    }}
                    {...item}
                />
            )}
            size="small"
            onChange={(e, page) => onPageChange(e, page - 1)}
        />
    );
};

type ITablePaginationProps = TablePaginationProps & {
    width: number;
    height: number;
};

export const TablePagination = ({
    width,
    height,
    ...props
}: ITablePaginationProps) => {

    const isGrow =  width > ACTION_GROW;

    const Actions = isGrow
        ? TableActions
        : undefined;

    return (
        <MatTablePagination
            {...props}
            component={TablePaginationContainer}
            ActionsComponent={Actions}
        />
    );
};

export default TablePagination;
