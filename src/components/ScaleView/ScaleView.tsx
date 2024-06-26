import * as React from 'react';
import { useEffect, useState } from 'react';

import { makeStyles } from '../../styles';
import { debounce } from '@mui/material';

import Box from '@mui/material/Box';

import classNames from '../../utils/classNames';

const SCALE_CONTAINER = 'react-declarative__scaleContainer';
const SCALE_DEBOUNCE = 1_000;

/**
 * Interface for the properties of the ScaleView component.
 */
interface IScaleViewProps {
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
    stretch?: boolean;
    center?: boolean;
}

/**
 * The `useStyles` variable is a function that returns an object containing CSS classes.
 * The returned object maps class names to their corresponding CSS styles.
 * These styles are created using the `makeStyles` function provided by the `@material-ui/core/styles` module.
 *
 * @returns An object containing CSS class names and their corresponding styles.
 *
 */
const useStyles = makeStyles()({
    root: {
        position: 'relative',
        overflow: 'hidden',
    },
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        minHeight: '100%',
        minWidth: '100%',
        '& > *:nth-of-type(1)': {
            transformOrigin: 'top left',
        },
    },
    stretch: {
        display: 'flex',
        alignItems: 'stretch',
        justifyContent: 'stretch',
        '& > *:nth-of-type(1)': {
            flex: 1,
        },
    },
    center: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

/**
 * Represents a component that scales its children based on its size.
 * @typedef IScaleViewProps
 * @property children - The children elements to be scaled.
 * @property className - The class name of the root div element.
 * @property style - The custom style of the root div element.
 * @property stretch - Determines whether to stretch the scaled children to fit the container.
 * @property center - Determines whether to center the scaled children within the container.
 */
export const ScaleView = ({
    children,
    className,
    style,
    stretch = false,
    center = false,
}: IScaleViewProps) => {
    const { classes } = useStyles();

    const [rootRef, setRootRef] = useState<HTMLDivElement | null>(null);

    const [transform, setTransform] = useState('none');
    const [marginBottom, setMarginBottom] = useState('inherit');
    const [marginRight, setMarginRight] = useState('inherit');

    useEffect(() => {

        /**
         * Calculates the size and positioning of a handle based on the dimensions of the content and container.
         *
         * @function handleSize
         *
         * @description This function calculates the size and positioning of a handle based on the dimensions of
         * the content and container elements. If the content is smaller than the container, no adjustments are made.
         * If the content is larger than the container, the handle is scaled down proportionally and positioned to
         * fit within the container.
         *
         * @returns This function does not return a value.
         */
        const handleSize = () => {
            if (!rootRef) {
                return;
            }
            const contentRef = rootRef.querySelector(`.${SCALE_CONTAINER} > *:nth-of-type(1)`);
            if (!contentRef) {
                return;
            }
            const { height: rootHeight, width: rootWidth } = rootRef.getBoundingClientRect();
            const { clientHeight: contentHeight, clientWidth: contentWidth } = contentRef;

            if (rootHeight > contentHeight && rootWidth > contentWidth) {
                setTransform('none');
                setMarginBottom('inherit');
                setMarginRight('inherit');
                return
            }

            const scaleY = Math.min(1.0, rootHeight / contentHeight);
            const scaleX = Math.min(1.0, rootWidth / contentWidth);
            const scaleAdjust = Number(Math.min(scaleX, scaleY).toFixed(2));

            setMarginBottom(`-${(contentHeight * (1 - scaleAdjust))}px`);
            setMarginRight(`-${(contentWidth * (1 - scaleAdjust))}px`);
            setTransform(`scale(${scaleAdjust})`);

        };

        const handleSizeD = debounce(handleSize, SCALE_DEBOUNCE);

        const observer = new ResizeObserver(handleSizeD);

        if (rootRef) {
            observer.observe(rootRef);
            handleSize();
        }

        return () => {
            rootRef && observer.unobserve(rootRef);
            handleSizeD.clear();
        };

    }, [rootRef]);

    /**
     * Sets the rootRef of the component using the supplied HTMLDivElement.
     *
     * @param rootRef - The HTMLDivElement to set as the rootRef.
     */
    const handleRef = (rootRef: HTMLDivElement | null) => {
        setRootRef(rootRef);
    };

    return (
        <div
            className={classNames(className, classes.root)}
            ref={handleRef}
            style={style}
        >
            <Box
                className={classNames(classes.container, SCALE_CONTAINER, {
                    [classes.stretch]: stretch,
                    [classes.center]: center,
                })}
                sx={{
                    '& > *:nth-of-type(1)': {
                        transform,
                        marginBottom,
                        marginRight,
                    },
                }}
            >
                {children}
            </Box>
        </div>
    );

};

export default ScaleView;
