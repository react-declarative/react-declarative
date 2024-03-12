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

/**
 * Represents a view that is constrained by the device's screen size to render different content
 *
 * @template T - The type of data passed to the view components
 * @param {Object} props - The props for the ConstraintView component
 * @param {React.ComponentType<T>} props.desktopView - The view component to render on desktop devices
 * @param {React.ComponentType<T>} props.tabletView - The view component to render on tablet devices
 * @param {React.ComponentType<T>} props.phoneView - The view component to render on phone devices
 * @param {function(string): void} props.onViewChanged - A callback function invoked when the view changes
 * @param {IChildParams<T>} props.params - The parameters to pass to the view components
 * @param {...otherProps} props - Any other props to pass to the component
 * @returns {React.ReactNode} - The rendered content based on the current device's screen size
 */
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
        const params = typeof payload === 'object' ? payload : { payload };
        if (isPhone(width)) {
            handleView('phone');
            return (
                <Phone {...params} />
            );
        } else if (isTablet(width)) {
            handleView('tablet');
            return (
                <Tablet {...params} />
            );
        } else {
            handleView('desktop');
            return (
                <Desktop {...params} />
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
