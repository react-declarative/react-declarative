import * as React from 'react';

import { makeStyles } from '../../../../../styles';

import ActionIcon from '../../../../ActionIcon';

import { IIconSlot } from '../../../slots/IconSlot';

import ArrowForward from '@mui/icons-material/ArrowForward';

const useStyles = makeStyles()({
    root: {
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
    },
});

/**
 * Represents a icon component.
 */
export const Icon = ({
    disabled,
    click,
    icon: Icon = ArrowForward,
    iconSize,
    iconColor,
}: IIconSlot) => {
    const { classes } = useStyles();
    return (
        <ActionIcon
            className={classes.root}
            size={iconSize}
            color={iconColor}
            disabled={disabled}
            onClick={click}
        >
            <Icon />
        </ActionIcon>
    );
};

export default Icon;

