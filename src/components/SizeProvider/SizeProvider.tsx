import * as React from 'react';
import { useEffect, useState } from 'react';

import { makeStyles } from '../../styles';
import { debounce } from '@mui/material';

import Box, { BoxProps } from '@mui/material/Box';

import createValueProvider from '../../utils/createValueProvider';
import classNames from '../../utils/classNames';

import ISize from '../../model/ISize';

interface ISizeProvider extends Omit<BoxProps, keyof {
    ref: never;
}> {
    target?: HTMLElement;
}

const useStyles = makeStyles()({
    root: {
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'stretch',
        justifyContent: 'stretch',
        '& > *:nth-of-type(1)': {
            flex: 1,
        },
    },
})

const [
    SizeContextProvider,
    useSize,
] = createValueProvider<ISize>();

/**
 * Provides the size of a target element.
 *
 * @param {Object} props - The properties used by the SizeProvider component.
 * @param {ReactNode} props.children - The child elements.
 * @param {string} props.className - The class name to be added to the root element.
 * @param {HTMLElement} props.target - The target element to observe for size changes.
 * @returns {ReactElement} The SizeProvider component.
 */
export const SizeProvider = ({
    children,
    className,
    target,
    ...props
}: ISizeProvider) => {

    const { classes } = useStyles();

    const [rootRef, setRootRef] = useState<HTMLElement | null>(null);
    
    const [size, setSize] = useState<ISize>({
        height: 0,
        width: 0,
    });

    useEffect(() => {

        const elementRef = target || rootRef;

        if (!elementRef) {
            return;
        }

        const handleResize = debounce(() => {
            const { height, width } = elementRef.getBoundingClientRect();
            setSize({ height, width });
        });

        const observer = new ResizeObserver(handleResize);

        handleResize();

        observer.observe(elementRef);

        return () => {
            observer.unobserve(elementRef);
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
