import * as React from 'react';
import { useState, useRef, useEffect } from 'react';

import { makeStyles } from '../../../styles';

import { debounce } from "@mui/material";

import classNames from '../../../utils/classNames';

import DefaultFade from './DefaultFade';

import { SCROLL_VIEW_TARGER } from '../ScrollView';

const FADE_ANIMATION_DELAY = 50;

const useStyles = makeStyles({
    root: {
        position: 'relative',
        display: 'flex',
        alignItems: 'stretch',
        justifyContent: 'stretch',
    },
    container: {
        flex: 1,
    },
    fade: {
        position: 'absolute',
        pointerEvents: 'none',
        height: 75,
        bottom: 0,
        right: 0,
        left: 0,
    },
});

export interface IBottomFadeProps {
    className?: string;
    Fade?: typeof DefaultFade;
    style?: React.CSSProperties;
    children: React.ReactChild;
    color?: string;
    selector?: string;
    zIndex?: number;
}

interface IState {
    visible: boolean;
    none: boolean;
}

declare var ResizeObserver: any;

export const BottomFade = ({
    className,
    style,
    color,
    children,
    zIndex = 9,
    Fade = DefaultFade,
    selector = `.${SCROLL_VIEW_TARGER}`,
}: IBottomFadeProps) => {
    const classes = useStyles();

    const [elementRef, setElementRef] = useState<HTMLDivElement>();

    const [state, setState] = useState<IState>({
        visible: false,
        none: true,
    });

    const lastCopyRef = useRef<IState>(state);

    useEffect(() => {
        lastCopyRef.current = state;
    }, [state]);

    useEffect(() => {
        if (elementRef) {
            const scrollViewRef = elementRef.querySelector(selector);
            if (scrollViewRef) {
                const copy = Object.assign({}, lastCopyRef.current);
                const update = debounce(() => setState({...copy}), FADE_ANIMATION_DELAY);
                const handleScroll = () => {
                    const { scrollTop } = scrollViewRef;
                    copy.visible = scrollTop === 0;
                    copy.none = false;
                    update();
                };
                const handleResize = () => {
                    const { scrollHeight, clientHeight } = scrollViewRef;
                    copy.none = scrollHeight <= clientHeight;
                    update();
                };
                const observer = new ResizeObserver(handleResize);
                observer.observe(scrollViewRef);
                handleScroll();
                handleResize();
                scrollViewRef.addEventListener("scroll", handleScroll, { passive: true });
                window.addEventListener("resize", handleResize, { passive: true });
                return () => {
                    scrollViewRef.removeEventListener("scroll", handleScroll);
                    window.removeEventListener("resize", handleResize);
                    observer.unobserve(scrollViewRef);
                    update.clear();
                };
            }
            return () => null;
        }
        return () => null;
    }, [selector, elementRef]);

    const handleElementRef = (elementRef: HTMLDivElement) => setElementRef(elementRef);

    return (
        <div className={classNames(classes.root, className)} style={style}>
            <div
                className={classes.container}
                ref={handleElementRef}
            >
                {children}
            </div>
            <Fade
                className={classes.fade}
                visible={state.visible}
                none={state.none}
                color={color}
                zIndex={zIndex}
            />
        </div>
    );
};

export default BottomFade;
