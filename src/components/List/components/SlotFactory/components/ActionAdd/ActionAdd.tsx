import * as React from 'react';

import useProps from "../../../../hooks/useProps";

import Fab from '@mui/material/Fab';

import Add from '@mui/icons-material/Add';

import IActionAddSlot from '../../../../slots/ActionAddSlot/IActionAddSlot';

export const ActionAdd = ({
    action = 'add-action',
}: IActionAddSlot) => {

    const listProps = useProps();

    const {
        onAction,
    } = listProps;

    const handleClick = (e: any) => {
        e.stopPropagation();
        onAction && onAction(action);
    };

    return (
        <Fab size="small" color="primary" onClick={handleClick}>
            <Add color="inherit" />
        </Fab>
    );
};

export default ActionAdd;