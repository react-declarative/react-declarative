import * as React from 'react';
import { useState, useEffect } from 'react';

import List from "@mui/material/List";

import MoreIcon from '@mui/icons-material/ExpandMore';
import LessIcon from '@mui/icons-material/ExpandLess';

import MenuOption from './MenuOption';

import useLifted from '../hooks/useLifted';

import IMenuGroup from '../../../model/IMenuGroup';

const PADDING_LEFT_STEP = 12;

interface ISideMenuProps {
    options: IMenuGroup[];
    paddingLeft?: number;
    selected?: string;
    onClick: (name: string) => void;
}

export const SideMenu = ({
    paddingLeft = -PADDING_LEFT_STEP,
    selected,
    options,
    onClick,
}: ISideMenuProps) => {

    const MenuGroup = ({
        item,
        currentPadding,
    }: {
        item: Required<IMenuGroup>;
        currentPadding: number;
    }) => {
        const upperLifted = useLifted();

        const [lifted, setLifted] = useState(item.lifted || false);

        useEffect(() => {
            if (upperLifted) {
                setLifted(true);
            } else {
                setLifted(item.lifted || false);
            }
        }, [upperLifted]);

        const icon = lifted
            ? () => <MoreIcon />
            : () => <LessIcon />;

        const handleClick = () => {
            setLifted((lifted) => !lifted);
        };

        return (
            <React.Fragment >
                <MenuOption
                    key={item.name}
                    option={item}
                    selected={selected}
                    onClick={handleClick}
                    icon={item.icon || icon}
                    currentPadding={currentPadding}
                />
                {lifted && (
                    <SideMenu
                        options={item.options}
                        selected={selected}
                        paddingLeft={currentPadding}
                        onClick={onClick}
                    />
                )}
            </React.Fragment>
        );
    };

    const child = options.map(((item, idx) => {
        const currentPadding = paddingLeft + PADDING_LEFT_STEP;
        if (item.options && item.options.length) {
            return (
                <MenuGroup
                    key={idx}
                    item={item as Required<IMenuGroup>}
                    currentPadding={currentPadding}
                />
            );
        } else {
            return (
                <MenuOption
                    key={idx}
                    option={item}
                    icon={item.icon}
                    selected={selected}
                    onClick={onClick}
                    currentPadding={currentPadding}
                />
            );
        }
    }));

    if (paddingLeft === -PADDING_LEFT_STEP) {
        return (
            <List disablePadding>
                {child}
            </List>
        );
    } else {
        return (
            <>
                {child}
            </>
        );
    }
};

export default SideMenu;
