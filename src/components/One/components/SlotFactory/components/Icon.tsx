import * as React from 'react';

import { makeStyles } from '../../../../../styles';

import ActionIcon from '../../../../ActionIcon';

import { IIconSlot } from '../../../slots/IconSlot';

import { useOnePayload } from "../../../context/PayloadProvider";
import { useOneState } from "../../../context/StateProvider";

import classNames from '../../../../../utils/classNames';

import ArrowForward from '@mui/icons-material/ArrowForward';

const useStyles = makeStyles()((theme) => ({
    root: {
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
    },
    container: {
        display: 'flex',
        alignItems: 'stretch',
        justifyContent: 'stretch',
        borderRadius: '50%',
    },
    backgroundPrimary: {
        background: theme.palette.primary.main,
    },
    backgroundSecondary: {
        background: theme.palette.secondary.main,
    },
    backgroundError: {
        background: theme.palette.error.main,
    },
    backgroundInfo: {
        background: theme.palette.info.main,
    },
    backgroundSuccess: {
        background: theme.palette.success.main,
    },
    backgroundWarning: {
        background: theme.palette.warning.main,
    },
}));

/**
 * Represents an icon component.
 */
export const Icon = ({
    disabled,
    click,
    icon: Icon = ArrowForward,
    iconSize,
    iconColor,
    iconBackground,
}: IIconSlot) => {
    const { classes } = useStyles();  
    const payload = useOnePayload();
    const { object: data } = useOneState();
    return (
        <div className={classes.root}>
            <div
                className={classNames(classes.container, {
                    [classes.backgroundPrimary]: iconBackground === "primary",
                    [classes.backgroundSecondary]: iconBackground === "secondary",
                    [classes.backgroundError]: iconBackground === "error",
                    [classes.backgroundInfo]: iconBackground === "info",
                    [classes.backgroundSuccess]: iconBackground === "success",
                    [classes.backgroundWarning]: iconBackground === "warning",
                })}
            >
                <ActionIcon
                    size={iconSize}
                    color={iconColor}
                    disabled={disabled}
                    onClick={click}
                >
                    <Icon 
                        data={data}
                        payload={payload}
                    />
                </ActionIcon>
            </div>
        </div>
    );
};

export default Icon;

