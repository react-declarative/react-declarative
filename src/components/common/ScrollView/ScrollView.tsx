import * as React from 'react';

import { makeStyles } from '../../../styles';

import classNames from '../../../utils/classNames';

import AutoSizer, { IAutoSizerProps } from '../AutoSizer';

import IAnything from '../../../model/IAnything';

export const SCROLL_VIEW_TARGER = 'react-declarative__scrollViewTarget';

const useStyles = makeStyles({
    root: {
        overflow: 'auto !important',
        scrollbarWidth: 'none',
        '&::-webkit-scrollbar': {
            display: 'none',
        },
    },
    container: {
        position: 'relative',
    },
    content: {
        position: 'absolute',
        top: 0,
        left: 0,
        display: 'flex',
    },
    stretch: {
        alignItems: 'stretch',
        justifyContent: 'stretch',
        '& > *': {
            flex: 1,
        },
    },
    center: {
        alignItems: 'center',
        justifyContent: 'center',
    },
});

interface IScrollViewProps<T extends IAnything = IAnything> {
    children: React.ReactChild;
    className?: string;
    style?: React.CSSProperties;
    center?: boolean;
    payload?: IAutoSizerProps<T>["payload"];
    heightRequest?: IAutoSizerProps<T>["heightRequest"];
    widthRequest?: IAutoSizerProps<T>["widthRequest"];
}

export const ScrollView = <T extends IAnything = IAnything> ({
    children,
    className,
    style,
    payload,
    heightRequest,
    widthRequest,
    center = false,
}: IScrollViewProps<T>) => {
    const classes = useStyles();
    return (
        <div className={className} style={style}>
            <AutoSizer
                className={classNames(classes.root, SCROLL_VIEW_TARGER)}
                heightRequest={heightRequest}
                widthRequest={widthRequest}
                payload={payload}
            >
                {({ height, width }) => (
                    <div className={classes.container}>
                        <div
                            className={classNames(classes.content, {
                                [classes.stretch]: !center,
                                [classes.center]: center,
                            })}
                            style={{
                                minHeight: height,
                                minWidth: width,
                            }}
                        >
                            {children}
                        </div>
                    </div>
                )}
            </AutoSizer>
        </div>
    );
};

export default ScrollView;
