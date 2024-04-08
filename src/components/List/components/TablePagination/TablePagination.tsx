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

/**
 * This variable `useStyles` is a function that generates CSS styles using the `makeStyles` function from the Material-UI library.
 *
 * @type {Function}
 * @returns The generated CSS styles.
 */
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

/**
 * Generates a default label for the selected items based on the given size.
 *
 * @param size - The number of selected items.
 * @returns A string representing the default label.
 */
const selectionLabelDefault = (size: number) => {
    return `Selected: ${wordForm(size, {
        one: 'item',
        many: 'items',
    })}`;
};

/**
 * Function that returns a component for displaying a loading indicator.
 * This component uses Material-UI's CircularProgress component to show a loading spinner.
 *
 * @return The loading indicator component.
 * @category Components
 */
const SelectionLabelLoader = () => (
    <CircularProgress
        size="16px"
    />
);

/**
 * TablePaginationContainer is a React functional component that renders a container for table pagination.
 * It accepts props to style and customize the container.
 *
 * @param props - The props object containing styling and customization options for the container
 * @returns - A container element with pagination features
 */
const TablePaginationContainer = (props: BoxProps) => {
    const { classes } = useStyles();
    const { selection } = useSelection();
    const { loading, selectionLabel = selectionLabelDefault, fallback, rows } = useProps();
    /**
     * Retrieves the label for the current selection.
     *
     * @returns The label of the current selection.
     */
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

/**
 * Renders a table pagination with options like page number, rows per page, etc.
 *
 * @param options - The options object for configuring the pagination.
 * @param [options.className] - The class name for the pagination container.
 * @param options.rowsPerPage - The number of rows to display per page.
 * @param options.count - The total number of rows in the table.
 * @param options.page - The current page number.
 * @param options.onPageChange - The callback function to be called when the page is changed.
 */
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

/**
 * Interface for the props of the TablePagination component.
 */
type ITablePaginationProps = TablePaginationProps & {
    width: number;
    height: number;
};

/**
 * Represents a table pagination component.
 * @param width - The width of the table pagination.
 * @param height - The height of the table pagination.
 * @param props - Additional props passed to the component.
 * @returns The rendered table pagination component.
 */
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
        limit,
        loading,
    } = useProps();

    const isGrow =  width > ACTION_GROW && withRangePagination;

    /**
     * Represents the Actions variable.
     *
     * @typedef Actions
     * @property isGrow - The value of Actions when isGrow is true.
     * @property undefined - The value of Actions when isGrow is false.
     * @public
     */
    const Actions = isGrow
        ? TableActions
        : undefined;

    const {
        count,
        rowsPerPage,
        page,
        onPageChange
    } = props;

    /**
     * Handles the arrow keydown event.
     *
     * @param e - The keyboard event object.
     * @param go - The number of pages to move.
     * @returns
     */
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
            labelDisplayedRows={({ page, count }) => {
                if (count === -1) {
                    return `#${page + 1}`;
                }
                return `${page + 1}/${Math.ceil(count / limit)}`;
            }}
            labelRowsPerPage=""
            ActionsComponent={Actions}
        />
    );
};

export default TablePagination;
