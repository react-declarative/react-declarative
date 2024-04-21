import * as React from 'react';
import { useMemo, useRef, useState } from 'react';

import Box from '@mui/material/Box';
import Backdrop from '@mui/material/Backdrop';

import useSwipeable from '../../../hooks/useSwipable';
import useActualValue from '../../../hooks/useActualValue';

import { CLOSED_WIDTH, OPENED_WIDTH, TOGGLE_WIDTH } from '../config';

interface IDrawerProps {
    variant?: 'permanent' | 'temporary';
    opened: boolean;
    onOpenChange: (opened: boolean) => void;
    children: JSX.Element;
}

export const Drawer = ({
    variant = 'temporary',
    onOpenChange,
    children,
    opened,
}: IDrawerProps) => {
    const [width, setWidth] = useState(OPENED_WIDTH);
    const [swiping, setSwiping] = useState(false);
    const pendingOpenedRef = useRef(opened);

    const opened$ = useActualValue(opened);

    const computeWidth = useMemo(() => {
        if (swiping) {
            return width;
        }
        return opened ? OPENED_WIDTH : CLOSED_WIDTH;
    }, [width, opened, swiping]);

    const handlerList = useSwipeable({
        onSwiped: () => {
            setSwiping(false);
            onOpenChange(pendingOpenedRef.current);
        },
        onSwiping: ({
            initial,
            deltaX,
            dir,
            event
        }) => {
            if (opened$.current) {
                return;
            }
            if (dir === 'Left' || dir === 'Right') {
                event.stopPropagation();
                event.preventDefault();
                setSwiping(true);
            }
            const [left] = initial;
            const xPos = left + deltaX;
            const pendingOpened = xPos > TOGGLE_WIDTH;
            setWidth(Math.max(Math.min(xPos, OPENED_WIDTH), CLOSED_WIDTH));
            pendingOpenedRef.current = pendingOpened;
        },
    });

    return (
        <>
            <Box
                sx={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    bottom: 0,
                    height: '100%',
                    width: computeWidth,
                    transition: swiping ? 'unset' : 'width 50ms',
                    overflowX: 'hidden',
                    overflowY: 'auto',
                    scrollbarWidth: 'none',
                    background: (theme) => theme.palette.background.paper,
                    display: 'flex',
                    alignItems: 'stretch',
                    justifyContent: 'stretch',
                    zIndex: 9999,
                }}
                {...handlerList}
            >
                <Box
                    sx={{
                        minWidth: OPENED_WIDTH,
                        maxWidth: OPENED_WIDTH,
                        pointerEvents: swiping ? 'none' : 'all',
                        flex: 1,
                    }}
                >
                    {children}
                </Box>
            </Box>
            {variant === "temporary" && (
                <Backdrop
                    sx={{ zIndex: 9998 }}
                    open={opened || swiping}
                    onClick={() => onOpenChange(false)}
                />
            )}
            <Box sx={{ minWidth: variant === "permanent" ? computeWidth : CLOSED_WIDTH }} />
        </>
    )
};

export default Drawer;
