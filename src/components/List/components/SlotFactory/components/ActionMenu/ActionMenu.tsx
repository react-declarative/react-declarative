import * as React from 'react';

import { makeStyles } from '../../../../../../styles';

import BaseActionMenu from '../../../../../ActionMenu';

import useProps from "../../../../hooks/useProps";

import IActionMenuSlot from '../../../../slots/ActionMenuSlot/IActionMenuSlot';

import Refresh from '@mui/icons-material/Refresh';
import Sort from '@mui/icons-material/Sort';

const useStyles = makeStyles({
    root: {
        zIndex: 'unset !important',
    },
});

export const ActionMenu = ({
    options = [],
}: IActionMenuSlot) => {

    const classes = useStyles();

    const {
        onAction,
        fallback,
    } = useProps();

    return (
        <BaseActionMenu
            className={classes.root}
            options={options.map(({
                action,
                ...other
            }) => {
                if (action === 'update-now') {
                    return {
                        ...other,
                        action,
                        icon: Refresh,
                        label: 'Refresh manually'
                    }
                } else if (action === 'resort-action') {
                    return {
                        ...other,
                        action,
                        icon: Sort,
                        label: 'Change sort order'
                    }
                } else {
                    return {
                        action,
                        ...other
                    }
                }
            })}
            onAction={onAction}
            fallback={fallback}
        />
    );
}

export default ActionMenu;