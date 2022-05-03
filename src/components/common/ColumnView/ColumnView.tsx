import * as React from 'react';

import { useTheme } from '@mui/material';

import AutoSizer, { IAutoSizerProps, IChildParams } from '../AutoSizer';

import IAnything from '../../../model/IAnything';

interface IColumnViewProps<T extends IAnything = IAnything> extends Omit<IAutoSizerProps<T>, keyof {
    children: never;
}> {
    phoneView?: React.ComponentType<any>;
    tabletView?: React.ComponentType<any>;
    desktopView?: React.ComponentType<any>;
}

// const GRID_MAX_WIDTH = 9999999999999999;

const match = (from: number, to: number) => (width: number) => width >= from && width < to;

export const ColumnView = <T extends IAnything = IAnything>({
    desktopView: Desktop = () => <></>,
    tabletView: Tablet = Desktop,
    phoneView: Phone = Tablet,
    ...otherProps
}: IColumnViewProps<T>) => {

    const {
        breakpoints: {
            values: {
                xs = 0,
                sm = 600,
                // md = 960,
                lg = 1280,
                // xl = 1536,
            }
        }
    } = useTheme();

    const isPhone = match(xs, sm);
    const isTablet = match(sm, lg);
    // const isDesktop = match(lg, GRID_MAX_WIDTH);

    const renderContent = ({ width, payload }: IChildParams<T>) => {
        if (isPhone(width)) {
            return (
                <Phone {...payload} />
            );
        } else if (isTablet(width)) {
            return (
                <Tablet {...payload} />
            );
        } else {
            return (
                <Desktop {...payload} />
            );
        }
    };

    return (
        <AutoSizer {...otherProps}>
            {renderContent}
        </AutoSizer>
    );
};

export default ColumnView;
