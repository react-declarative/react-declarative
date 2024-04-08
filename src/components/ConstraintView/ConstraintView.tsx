import * as React from 'react';
import { useMemo, useRef } from 'react';

import { useTheme } from '@mui/material';

import AutoSizer, { IAutoSizerProps, IChildParams } from '../AutoSizer';

import IAnything from '../../model/IAnything';

/**
 * Interface for props of ConstraintView component.
 * @template T - Type parameter for IConstraintViewProps.
 */
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

/**
 * Represents a function that returns a boolean value indicating whether a given width falls within a specified range.
 *
 * @param from - The lower bound of the range (inclusive).
 * @param to - The upper bound of the range (exclusive).
 * @returns - A function that takes a width and returns true if it is within the specified range, false otherwise.
 */
const match = (from: number, to: number) => (width: number) => width >= from && width < to;

/**
 * Represents a view that is constrained by the device's screen size to render different content
 *
 * @template T - The type of data passed to the view components
 * @param props - The props for the ConstraintView component
 * @param props.desktopView - The view component to render on desktop devices
 * @param props.tabletView - The view component to render on tablet devices
 * @param props.phoneView - The view component to render on phone devices
 * @param props.onViewChanged - A callback function invoked when the view changes
 * @param props.params - The parameters to pass to the view components
 * @param props - Any other props to pass to the component
 * @returns - The rendered content based on the current device's screen size
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

        /**
         * Configuration object for device breakpoints.
         *
         * @typedef Config
         * @property isPhone - Indicates if the device matches the phone breakpoint.
         * @property isTablet - Indicates if the device matches the tablet breakpoint.
         * @property isDesktop - Indicates if the device matches the desktop breakpoint.
         */
        return {
            isPhone: match(xs, sm),
            isTablet: match(sm, lg),
            isDesktop: match(lg, GRID_MAX_WIDTH),
        };

    }, [theme]);

    /**
     * This function handles the view change.
     *
     * @param name - The name of the view to be changed to.
     * @returns
     */
    const handleView = (name: string) => {
        if (lastView.current !== name) {
            onViewChanged && onViewChanged(name);
        }
        lastView.current = name;
    }

    /**
     * Renders content based on the width and payload.
     *
     * @param props - The object containing width and payload.
     * @param props.width - The width value.
     * @param props.payload - The payload object.
     * @returns - The rendered content based on the conditions.
     */
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
