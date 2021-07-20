import * as React from 'react';

import List from "@material-ui/core/List";

import IMenuGroup from '../../model/IMenuGroup';

import MenuOption from './MenuOption';

const PADDING_LEFT_STEP = 8;

interface ISideMenuProps {
    options: IMenuGroup[];
    paddingLeft?: number;
    selected?: string;
    onClick: (name: string) => void;
}

export const SideMenu = ({
    paddingLeft = 0,
    selected,
    options,
    onClick,
}: ISideMenuProps) => {

    const child = options.map(((item, idx) => {
        const currentPadding = paddingLeft + PADDING_LEFT_STEP;
        if (item.options && item.options.length) {
            return (
                <React.Fragment key={idx}>
                    <MenuOption
                        key={item.name}
                        option={item}
                        selected={selected}
                        onClick={onClick}
                        style={{paddingLeft}}
                    />
                    <SideMenu
                        options={item.options}
                        selected={selected}
                        paddingLeft={currentPadding}
                        onClick={onClick}
                    />
                </React.Fragment>
            );
        } else {
            return (
                <MenuOption
                    key={idx}
                    option={item}
                    selected={selected}
                    onClick={onClick}
                    style={{paddingLeft: currentPadding}}
                />
            );
        }
    }));

    if (paddingLeft === 0) {
        return (
            <List>
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
