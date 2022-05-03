import * as React from 'react';
import { useMemo, useRef } from 'react';

import { useTheme } from '@mui/material';

import AutoSizer, { IAutoSizerProps, IChildParams } from '../AutoSizer';

import IAnything from '../../model/IAnything';

interface IConstraintViewProps<T extends IAnything = IAnything> extends Omit<IAutoSizerProps<T>, keyof {
    children: never;
}> {
    phoneView?: React.ComponentType<any>;
    tabletView?: React.ComponentType<any>;
    desktopView?: React.ComponentType<any>;
    onViewChanged?: (name: string) => void;
    params?: IChildParams<T>;
}

const GRID_MAX_WIDTH = 9999999999999999;

const match = (from: number, to: number) => (width: number) => width >= from && width < to;

export const ConstraintView = <T extends IAnything = IAnything>({
    desktopView: Desktop = () => <></>,
    tabletView: Tablet = Desktop,
    phoneView: Phone = Tablet,
    onViewChanged,
    params,
    ...otherProps
}: IConstraintViewProps<T>) => {

    const theme = useTheme();
    const lastView = useRef('');

    const {
        isPhone,
        isTablet,
    } = useMemo(() => {
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
        } = theme;

        const isPhone = match(xs, sm);
        const isTablet = match(sm, lg);
        const isDesktop = match(lg, GRID_MAX_WIDTH);

        return {
            isPhone,
            isTablet,
            isDesktop,
        };

    }, [theme]);

    const handleView = (name: string) => {
        if (lastView.current !== name) {
            onViewChanged && onViewChanged(name);
        }
        lastView.current = name;
    }

    const renderContent = ({ width, payload }: IChildParams<T>) => {
        if (isPhone(width)) {
            handleView('phone');
            return (
                <Phone {...payload} />
            );
        } else if (isTablet(width)) {
            handleView('tablet');
            return (
                <Tablet {...payload} />
            );
        } else {
            handleView('desktop');
            return (
                <Desktop {...payload} />
            );
        }
    };

    if (params) {
        return renderContent(params);
    } else {
        return (
            <AutoSizer {...otherProps}>
                {renderContent}
            </AutoSizer>
        );
    }

};

export default ConstraintView;
