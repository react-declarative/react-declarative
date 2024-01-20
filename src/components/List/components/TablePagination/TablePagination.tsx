import * as React from 'react';
import { useEffect } from 'react';

import { makeStyles } from '../../../../styles';

import MatTablePagination from '@mui/material/TablePagination';
import CircularProgress from '@mui/material/CircularProgress';
import PaginationItem from '@mui/material/PaginationItem';
import Pagination from '@mui/material/Pagination';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import { TablePaginationProps } from '@mui/material/TablePagination';
import { BoxProps } from '@mui/material/Box';

import ArrowBackIcon from '@mui/icons-material/KeyboardArrowLeft';
import ArrowForwardIcon from '@mui/icons-material/KeyboardArrowRight';

import Async from '../../../Async';

import useActualCallback from '../../../../hooks/useActualCallback';
import useSelection from '../../hooks/useSelection';
import useProps from '../../hooks/useProps';

import classNames from '../../../../utils/classNames';
import wordForm from '../../../../utils/wordForm';

const ACTION_GROW = 500;
const MIN_PAGES_COUNT = 10;

const useStyles = makeStyles()({
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

const selectionLabelDefault = (size: number) => {
    return `Selected: ${wordForm(size, {
        one: 'item',
        many: 'items',
    })}`;
};

const SelectionLabelLoader = () => (
    <CircularProgress
        size="16px"
    />
);

const TablePaginationContainer = (props: BoxProps) => {
    const { classes } = useStyles();
    const { selection } = useSelection();
    const { loading, selectionLabel = selectionLabelDefault, fallback, rows } = useProps();
    const getSelectionLabel = useActualCallback(() => selectionLabel(selection.size));
    return (
        <Box
            {...props}
            className={classNames(props.className, classes.root, {
                [classes.disabled]: loading,
            })}
        >   
            <Typography
                variant="body1"
                className={classes.label}
            >
                <Async
                    Loader={SelectionLabelLoader}
                    deps={[selection, rows]}
                    fallback={fallback}
                    throwError
                >
                    {getSelectionLabel}
                </Async>
            </Typography>
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
    const pages = Math.ceil(count / rowsPerPage);
    const paginationPage = page + 1;
    return (
        <Pagination
            className={className}
            page={paginationPage}
            count={count === -1 ? Math.max(paginationPage + 1, MIN_PAGES_COUNT): pages}
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

    const {
        withArrowPagination = false,
        withRangePagination = false,
        noDisplayedRows = false,
        rowsPerPage: rowsPerPageOptions,
        loading,
    } = useProps();

    const isGrow =  width > ACTION_GROW && withRangePagination;

    const Actions = isGrow
        ? TableActions
        : undefined;

    const {
        count,
        rowsPerPage,
        page,
        onPageChange
    } = props;

    const handleArrowKeydown = useActualCallback((e: any, go: number) => {
        if (count === -1) {
            onPageChange(e, Math.max(page + go, 0));
        } else {
            const totalPages = Math.ceil(count / rowsPerPage) - 1;
            onPageChange(e, Math.min(Math.max(page + go, 0), totalPages));
        }
    });

    useEffect(() => {
        const handler = (e: any) => {
            const { key } = e;
            if (key === 'ArrowRight') {
                handleArrowKeydown(e, 1);
            } else if (key === 'ArrowLeft') {
                handleArrowKeydown(e, -1);
            }
        };
        if (withArrowPagination && !loading) {
            document.addEventListener('keydown', handler);
        }
        return () => document.removeEventListener('keydown', handler);
    }, [withArrowPagination, loading]);

    return (
        <MatTablePagination
            {...props}
            sx={{
                ...(noDisplayedRows && {
                    '& .MuiTablePagination-displayedRows': {
                        display: 'none',
                    }
                }),
            }}
            component={TablePaginationContainer}
            rowsPerPageOptions={rowsPerPageOptions}
            labelDisplayedRows={({ page, count, from, to }) => {
                if (count === -1) {
                    return `#${page + 1}`;
                }
                const rowsPerPage = Math.max(to - (from - 1), 0);
                return `${page + 1}/${Math.ceil(count / rowsPerPage)}`
            }}
            labelRowsPerPage=""
            ActionsComponent={Actions}
        />
    );
};

export default TablePagination;
