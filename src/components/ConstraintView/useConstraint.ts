import { useMemo } from 'react';

import { useTheme } from '@mui/material';

const GRID_MAX_WIDTH = 9999999999999999;

const match = (from: number, to: number) => (width: number) => width >= from && width < to;

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

        const isPhoneFn = match(xs, sm);
        const isTabletFn = match(sm, lg);
        const isDesktopFn = match(lg, GRID_MAX_WIDTH);

        return {
            isPhoneFn,
            isTabletFn,
            isDesktopFn,
        };

    }, [theme]);

    return {
        isPhone: isPhoneFn(width),
        isTablet: isTabletFn(width),
        isDesktop: isDesktopFn(width),
    }

}

export default useConstraint;
