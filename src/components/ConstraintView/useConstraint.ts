import { useMemo } from 'react';

import { useTheme } from '@mui/material';

const GRID_MAX_WIDTH = 9999999999999999;

const match = (from: number, to: number) => (width: number) => width >= from && width < to;

/**
 * Returns an object with boolean properties indicating whether the given width matches the responsive breakpoints.
 *
 * @param width - The width to check against the responsive breakpoints.
 * @returns - An object with the following properties:
 *      - isPhone: A boolean indicating whether the width matches the phone breakpoint.
 *      - isTablet: A boolean indicating whether the width matches the tablet breakpoint.
 *      - isDesktop: A boolean indicating whether the width matches the desktop breakpoint.
 */
export const useConstraint = (width: number) => {
    const theme = useTheme();

    const {
        isPhoneFn,
        isTabletFn,
        isDesktopFn,
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
         * @property isPhoneFn - Function to determine if device is a phone.
         * @property isTabletFn - Function to determine if device is a tablet.
         * @property isDesktopFn - Function to determine if device is a desktop.
         */
        return {
            isPhoneFn: match(xs, sm),
            isTabletFn: match(sm, lg),
            isDesktopFn: match(lg, GRID_MAX_WIDTH),
        };

    }, [theme]);

    /**
     * Configuration object for device breakpoints.
     *
     * @typedef Config
     * @property isPhoneFn - Function to determine if device is a phone.
     * @property isTabletFn - Function to determine if device is a tablet.
     * @property isDesktopFn - Function to determine if device is a desktop.
     */
    return {
        isPhone: isPhoneFn(width),
        isTablet: isTabletFn(width),
        isDesktop: isDesktopFn(width),
    }

}

export default useConstraint;
