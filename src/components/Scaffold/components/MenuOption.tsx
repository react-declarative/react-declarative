import * as React from 'react';

import { makeStyles } from '../../../styles';

import classNames from '../../../utils/classNames';

import Box from "@mui/material/Box";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ButtonBase from "@mui/material/ButtonBase";

import { IMenuOption } from '../../../model/IMenuGroup';

import OutlinedFlag from "@mui/icons-material/OutlinedFlag";

/**
 * Represents props for a menu option
 * @interface
 */
interface IMenuOptionProps {
    option: IMenuOption;
    icon?: React.ComponentType<any>;
    style?: React.CSSProperties;
    selected?: string;
    className?: string;
    currentPadding: number;
    onClick: (name: string) => void;
}

const useStyles = makeStyles()((theme) => ({
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

/**
 * Represents a menu option component.
 *
 * @component
 *
 * @param props - The properties of the component.
 * @param props.option - The option data.
 * @param [props.style] - The inline style object for the component.
 * @param [props.icon] - The icon component to display.
 * @param [props.selected] - Indicates whether the option is selected.
 * @param [props.className] - The additional CSS class name(s) for the component.
 * @param [props.onClick] - The function to call when the option is clicked.
 * @param [props.currentPadding] - The padding for the option.
 *
 * @returns The rendered component.
 */
export const MenuOption: React.FC<IMenuOptionProps> = ({
    option,
    style,
    icon,
    selected,
    className,
    onClick,
    currentPadding: paddingLeft,
}) => {
    const { classes } = useStyles();

    const linkClasses = classNames(classes.navLink, {
        [classes.selected]: option.name && option.name === selected,
        [classes.disabled]: option.disabled,
        [classes.bold]: option.bold,
    });

    const handleClick = () => {
        onClick(option.name || 'unknown');
    };

    const Icon = icon || OutlinedFlag;

    return (
        <ButtonBase  
            className={classNames(classes.root, linkClasses, className)}
            style={style}
        >
            <Box style={{ paddingLeft }} />
            <ListItem
                onClick={handleClick}
            >
                <ListItemIcon style={{ maxWidth: 24 }}>
                    <Icon />
                </ListItemIcon>
                <ListItemText primary={option.label} />
            </ListItem>
        </ButtonBase>
    );
};

export default MenuOption;
