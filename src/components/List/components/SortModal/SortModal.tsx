import * as React from 'react';
import { useState } from 'react';

import { makeStyles } from '../../../../styles';
import { alpha } from '@mui/material';

import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';
import Box from '@mui/material/Box';

import ModalDialog from '../../../common/ModalDialog';

import IColumn from '../../../../model/IColumn';

import fieldToHeader from '../../helpers/fieldToHeader';

import ArrowUpIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownIcon from '@mui/icons-material/ArrowDownward';

import useSortModel from '../../hooks/useSortModel';

interface ISortModalProps {
    columns: IColumn[];
    onClose: () => void;
}

const useStyles = makeStyles()((theme, _, classes) => ({
    inactive: {
        opacity: 0.5,
    },
    container: {
        width: 300,
        height: 340,
    },
    list: {
        [`& > .${classes["item"]}:nth-of-type(2n)`]: {
            background: alpha(
                theme.palette.getContrastText(theme.palette.background.paper),
                0.04
            ),
        },
    },
    item: {
        '& .MuiListItemText-root > .MuiTypography-root': {
            maxWidth: 215,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
        },
    },
}));

/**
 * SortModal component for sorting columns.
 * @param ISortModalProps - The props object for SortModal. (columns, onClose)
 */
export const SortModal = ({
    columns,
    onClose,
}: ISortModalProps) => {

    const { classes } = useStyles();

    const { sortModel: resultSortModel, setSortModel: setResultSortModel } = useSortModel();
    const [ sortModel, setSortModel ] = useState(new Map(resultSortModel));

    const handleSortToggle = (id: string) => {
        const sortModelCopy = new Map(sortModel);
        const sortTarget = sortModelCopy.get(id);
        if (sortTarget) {
            if (sortTarget.sort === 'asc') {
                sortModelCopy.set(id, {
                    field: id,
                    sort: 'desc',
                });
            } else if (sortTarget.sort === 'desc') {
                sortModelCopy.delete(id);
            }
        } else {
            sortModelCopy.set(id, {
                field: id,
                sort: 'asc',
            });
        }
        setSortModel(sortModelCopy);
    };

    const handleAccept = () => {
        setResultSortModel(sortModel);
        onClose();
    };

    const handleDismiss = () => {
        onClose();
    };

    const sortableColumns = columns
        .map(({ sortable = true, ...other }) => ({ sortable, ...other }))
        .filter(({ sortable }) => sortable);

    return (
        <ModalDialog
            open
            onAccept={handleAccept}
            onDismiss={handleDismiss}
        >
            <Box className={classes.container}>
                <List className={classes.list} disablePadding>
                    {sortableColumns.map((column, idx) => {
                        const sortTarget = sortModel.get(column.field || '');
                        const sortDirection = sortTarget?.sort || undefined;
                        const handleClick = () => handleSortToggle(column.field!);

                        const Icon = sortDirection === 'asc' ? (
                            <ArrowUpIcon />
                        ) : sortDirection === 'desc' ? (
                            <ArrowDownIcon />
                        ) : (
                            <ArrowUpIcon
                                className={classes.inactive}
                            />
                        );

                        const { headerName = fieldToHeader(column.field || '') || 'Unknown' } = column;

                        return (
                            <ListItem
                                key={idx}
                                className={classes.item}
                                secondaryAction={Icon}
                                onClick={handleClick}
                                component={ListItemButton}
                            >
                                <ListItemText
                                    primary={headerName}
                                />
                            </ListItem>
                        );
                    })}
                </List>
            </Box>
        </ModalDialog>
    );
};

export default SortModal;
