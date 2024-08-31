import * as React from 'react';
import { useMemo, useRef, useState } from 'react';

import Box from '@mui/material/Box';
import Backdrop from '@mui/material/Backdrop';

import useSwipeable from '../../../hooks/useSwipable';

import { CLOSED_WIDTH, OPENED_WIDTH, TOGGLE_WIDTH } from '../config';

interface IDrawerProps {
    variant?: 'permanent' | 'temporary';
    opened: boolean;
    onOpenChange: (opened: boolean) => void;
    onSwipingChange: (swiping: boolean) => void;
    children: JSX.Element;
}

export const Drawer = ({
    variant = 'temporary',
    onOpenChange,
    onSwipingChange,
    children,
    opened,
}: IDrawerProps) => {
    const [width, setWidth] = useState(OPENED_WIDTH);
    const [swiping, setSwiping] = useState(false);
    const pendingOpenedRef = useRef(opened);

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
            onSwipingChange(false);
        },
        onSwiping: ({
            initial,
            deltaX,
            dir
        }) => {
            if (dir === 'Left' || dir === 'Right') {
                setSwiping(true);
                onSwipingChange(true);
            }
            const [left] = initial;
            const xPos = left + deltaX;
            const pendingOpened = xPos > TOGGLE_WIDTH;
            setWidth(Math.max(Math.min(xPos, OPENED_WIDTH), CLOSED_WIDTH));
            pendingOpenedRef.current = pendingOpened;
        },
        noPassive: true,
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
                    "&::-webkit-scrollbar": {
                        display: "none",
                    },
                    maxHeight: '100vh',
                    minHeight: '100vh',
                    background: (theme) => theme.palette.background.paper,
                    display: 'flex',
                    alignItems: 'stretch',
                    justifyContent: 'stretch',
                    zIndex: 998,
                }}
                {...handlerList}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'stretch',
                        justifyContent: 'stretch',
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
                    sx={{ zIndex: 997 }}
                    open={opened || swiping}
                    onClick={() => onOpenChange(false)}
                />
            )}
            <Box sx={{ minWidth: variant === "permanent" ? computeWidth : CLOSED_WIDTH }} />
        </>
    )
};

export default Drawer;
