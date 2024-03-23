import * as React from 'react';
import { useEffect, useState } from 'react';

import { makeStyles } from '../../styles';
import { debounce } from '@mui/material';

import Box, { BoxProps } from '@mui/material/Box';

import createValueProvider from '../../utils/createValueProvider';
import classNames from '../../utils/classNames';

import ISize from '../../model/ISize';

/**
 * Represents a size provider that provides size information for rendering components.
 * This interface extends the `BoxProps` interface from the `@material-ui/core` library, and allows
 * customization of the target element for size measurement.
 */
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
 * @param props - The properties used by the SizeProvider component.
 * @param props.children - The child elements.
 * @param props.className - The class name to be added to the root element.
 * @param props.target - The target element to observe for size changes.
 * @returns The SizeProvider component.
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

        /**
         * Handles resizing of the element.
         * @function handleResize
         * @memberof global
         * @param {function} callback - A callback function to execute when element is resized.
         */
        const handleResize = debounce(() => {
            const { height, width } = elementRef.getBoundingClientRect();
            setSize({ height, width });
        });

        /**
         * @description A ResizeObserver class that tracks changes in the size of a target element.
         *
         * @param {function} callback - The callback function to be called whenever a resize event occurs.
         *                             It will receive a list of ResizeObserverEntry objects as argument.
         *
         * @returns {object} The ResizeObserver instance.
         */
        const observer = new ResizeObserver(handleResize);

        handleResize();

        observer.observe(elementRef);

        return () => {
            observer.unobserve(elementRef);
            handleResize.clear();
        };

    }, [rootRef]);

    /**
     * Assigns the given reference to the root reference.
     *
     * @param ref - The reference to assign to the root reference.
     */
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
