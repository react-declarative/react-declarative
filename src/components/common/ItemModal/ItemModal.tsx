import * as React from 'react';
import { makeStyles } from '../../../styles';

import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';

import ModalLoader from './components/ModalLoader';

import ActionButton from '../../ActionButton';
import Tile from '../../Tile';

import IField from '../../../model/IField';
import IManaged from '../../../model/IManaged';
import IAnything from '../../../model/IAnything';

import useViewState from './hooks/useViewState';

import CloseIcon from '@mui/icons-material/Close';

export interface IItemModalProps {
    type: Exclude<IField['type'], undefined>;
    onValueChange: Exclude<IManaged['onChange'], undefined>;
    value: IAnything;
    data: IAnything;
    payload: IAnything;
    title: IField['title'];
    placeholder: IField['placeholder'];
    tip: IField['tip'];
    tr: IField['tr'];
    keepRaw: IField['keepRaw'];
    itemList: IField['itemList'];
}

const useStyles = makeStyles()((theme) => ({
    root: {
        marginTop: '10px',
        marginLeft: '10px',
        marginRight: '10px',
        gap: theme.spacing(1),
        height: 'calc(50vh - 20px)',
        width: 'calc(100vw - 20px)',
        display: 'flex',
        alignItems: 'stretch',
        justifyContent: 'stretch',
        flexDirection: 'column',
    },
    container: {
        position: 'relative',
        display: 'flex',
        alignItems: 'stretch',
        justifyContent: 'stretch',
        flex: 1,
    },
    content: {
        flex: 1,
    },
    submit: {
        width: 'calc(100% - 16px)',
        margin: '8px',
    },
}));

export const ItemModal = ({
    type,
    data,
    payload,
    itemList,
    tip,
    tr,
    keepRaw,
    value,
    title = "Search",
    placeholder,
    onValueChange,
}: IItemModalProps) => {
    const { classes } = useStyles();

    const {
        items,
        hasMore,
        loading,
        onSkip,
        onItemClick,
        onSelectedRows,
        searchText,
        selectedRows,
        setSearchText,
        renderItem,
        selectionMode,
        beginSubmit,
        cancelSubmit,
    } = useViewState({
        type,
        data,
        payload,
        value,
        itemList,
        tip,
        keepRaw,
        tr,
        onValueChange,
    });

    return (
        <Modal open onClose={cancelSubmit}>
            <Paper className={classes.root}>
                <TextField
                    value={searchText}
                    onChange={({ target }) => setSearchText(target.value)}
                    size="small"
                    variant="filled"
                    autoFocus
                    label={title}
                    placeholder={placeholder}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position='end'>
                                <IconButton edge='end' onClick={cancelSubmit}>
                                    <CloseIcon />
                                </IconButton>
                            </InputAdornment>
                        )
                    }}
                />
                <Box className={classes.container}>
                    <Tile
                        className={classes.content}
                        selectionMode={selectionMode}
                        selectedRows={selectedRows}
                        data={items}
                        hasMore={hasMore}
                        loading={loading}
                        onSkip={onSkip}
                        onItemClick={onItemClick}
                        onSelectedRows={onSelectedRows}
                    >
                        {renderItem}
                    </Tile>
                    <ModalLoader open={loading} />
                </Box>
                <ActionButton
                    className={classes.submit}
                    size="small"
                    variant="contained"
                    color="info"
                    onClick={beginSubmit}
                >
                    Submit
                </ActionButton>
            </Paper>
        </Modal>
    );
};

export default ItemModal;