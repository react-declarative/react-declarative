import * as React from 'react';
import { useEffect, useState } from 'react';

import { makeStyles } from '../../styles';
import { debounce } from '@mui/material';

import Box, { BoxProps } from '@mui/material/Box';

import { createStatelessProvider } from '../../utils/createProvider';
import classNames from '../../utils/classNames';

import ISize from '../../model/ISize';

interface ISizeProvider extends Omit<BoxProps, keyof {
    ref: never;
}> {
}

const useStyles = makeStyles({
    root: {
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'stretch',
        justifyContent: 'stretch',
        '& > *:nth-child(1)': {
            flex: 1,
        },
    },
})

const [
    SizeContextProvider,
    useSize,
] = createStatelessProvider<ISize>();

export const SizeProvider = ({
    children,
    className,
    ...props
}: ISizeProvider) => {

    const classes = useStyles();

    const [rootRef, setRootRef] = useState<HTMLElement | null>(null);
    
    const [size, setSize] = useState<ISize>({
        height: 0,
        width: 0,
    });

    useEffect(() => {

        if (!rootRef) {
            return;
        }

        const handleResize = debounce(() => {
            const { height, width } = rootRef.getBoundingClientRect();
            setSize({ height, width });
        });

        const observer = new ResizeObserver(handleResize);

        handleResize();

        observer.observe(rootRef);

        return () => {
            observer.unobserve(rootRef);
            handleResize.clear();
        };

    }, [rootRef]);

    const handleRef = (ref: any) => setRootRef(ref)

    return (
        <SizeContextProvider payload={size}>
            <Box
                className={classNames(classes.root, className)}
                ref={handleRef}
                {...props}
            >
                {children}
            </Box>
        </SizeContextProvider>
    );
};

export { useSize };

export default SizeProvider;
