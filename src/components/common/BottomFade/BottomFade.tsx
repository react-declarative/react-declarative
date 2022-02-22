import * as React from 'react';
import { useState, useEffect } from 'react';

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

interface IBottomFadeProps {
    className?: string;
    Fade?: typeof DefaultFade;
    style?: React.CSSProperties;
    children: React.ReactChild;
    selector?: string;
    zIndex?: number;
}

interface IState {
    visible: boolean;
    none: boolean;
}

export const BottomFade = ({
    className,
    style,
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

    useEffect(() => {
        if (elementRef) {
            const scrollViewRef = elementRef.querySelector(selector);
            if (scrollViewRef) {
                const copy = Object.assign({}, state);
                const update = debounce(() => setState({...copy}), FADE_ANIMATION_DELAY);
                const handleScroll = () => {
                    const { scrollTop } = scrollViewRef;
                    console.log({ scrollTop })
                    copy.visible = scrollTop === 0;
                    copy.none = false;
                    update();
                };
                const handleResize = () => {
                    const { scrollHeight, clientHeight } = scrollViewRef;
                    console.log({ scrollHeight, clientHeight  })
                    copy.none = scrollHeight <= clientHeight;
                    update();
                };
                handleScroll();
                handleResize();
                scrollViewRef.addEventListener("scroll", handleScroll, { passive: true });
                window.addEventListener("resize", handleResize, { passive: true });
                return () => {
                    scrollViewRef.removeEventListener("scroll", handleScroll);
                    window.removeEventListener("resize", handleResize);
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
                zIndex={zIndex}
            />
        </div>
    );
};

export default BottomFade;
