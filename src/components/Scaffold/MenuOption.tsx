import * as React from 'react';
import { makeStyles } from '@material-ui/core';

import classNames from '../../utils/classNames';

import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ButtonBase from "@material-ui/core/ButtonBase";

import { IMenuOption } from '../../model/IMenuGroup';

import OutlinedFlag from "@material-ui/icons/OutlinedFlag";
import FiberManualRecordRounded from "@material-ui/icons/FiberManualRecordRounded";

const DEFAULT_ICON = 'outlined-flag';

interface IMenuOptionProps {
    option: IMenuOption;
    style?: React.CSSProperties;
    selected?: string;
    className?: string;
    onClick: (name: string) => void;
}

const useStyles = makeStyles((theme) => ({
    selected: {
        color: `${theme.palette.primary.main} !important`,
        '& .MuiListItemIcon-root': {
            color: `${theme.palette.primary.main} !important`,
        },
    },
    disabled: {
        pointerEvents: 'none',
        touchAction: 'none',
        opacity: 0.5,
    },
    bold: {
        fontWeight: 'bold',
    },
    root: {
        display: 'flex',
        width: '100%',
        flex: 1,
        '& .MuiListItemIcon-root': {
            maxWidth: '36px !important',
            minWidth: '36px !important',
        },
    },
    navLink: {
        color: theme.palette.text.primary,
        '& .MuiListItemIcon-root': {
            color: theme.palette.text.primary,
        },
    },
}));

const createIcon = (icon: string | undefined) => {
    if (icon === 'dot') {
        return <FiberManualRecordRounded />
    } else if (icon === 'outlined-flag') {
        return <OutlinedFlag />
    } else {
        throw new Error('Scaffold unknown icon');
    }
};

export const MenuOption: React.FC<IMenuOptionProps> = ({ option, style, selected, className, onClick }) => {
    const classes = useStyles();

    const linkClasses = classNames(classes.navLink, {
        [classes.selected]: option.name && option.name === selected,
        [classes.disabled]: option.disabled,
        [classes.bold]: option.bold,
    });

    const handleClick = () => {
        const { name } = option;
        name && onClick(name);
    };

    return (
        <ButtonBase  
            className={classNames(classes.root, linkClasses, className)}
            style={style}
        >
            <ListItem
                onClick={handleClick}
            >
                <ListItemIcon style={{ maxWidth: 24 }}>
                    {createIcon(option.icon || DEFAULT_ICON)}
                </ListItemIcon>
                <ListItemText primary={option.label} />
            </ListItem>
        </ButtonBase>
    );
};

export default MenuOption;
