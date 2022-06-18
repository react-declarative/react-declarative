import * as React from 'react';

import useProps from "../../../../hooks/useProps";

import Fab from '@mui/material/Fab';

import Add from '@mui/icons-material/Add';

import IActionAddSlot from '../../../../slots/ActionAddSlot/IActionAddSlot';
import Async from '../../../../../Async';

const Fragment = () => <></>;

export const ActionAdd = ({
    action = 'add-action',
    isVisible = () => true,
    isDisabled = () => false,
}: IActionAddSlot) => {

    const listProps = useProps();

    const {
        onAction,
        fallback,
    } = listProps;

    const handleClick = (e: any) => {
        e.stopPropagation();
        onAction && onAction(action);
    };

    return (
        <Async Loader={Fragment} fallback={fallback}>
            {async () => {
                const visible = await isVisible();
                const disabled = await isDisabled();
                if (visible) {
                    return (
                        <Fab disabled={disabled} size="small" color="primary" onClick={handleClick}>
                            <Add color="inherit" />
                        </Fab>
                    );
                } else {
                    return null;
                }
            }}
        </Async>
    );
};

export default ActionAdd;