import * as React from 'react';

import { useProps } from "../../../PropProvider";

import Fab from '@material-ui/core/Fab';

import Add from '@material-ui/icons/Add';

interface IActionAddProps {
    action?: string;
}

export const ActionAdd = ({
    action = 'add-action',
}: IActionAddProps) => {

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
            <Add />
        </Fab>
    );
};

export default ActionAdd;