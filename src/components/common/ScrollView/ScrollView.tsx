import * as React from 'react';

import { makeStyles } from '../../../styles';

import classNames from '../../../utils/classNames';

import AutoSizer from '../AutoSizer';

export const SCROLL_VIEW_TARGER = 'react-declarative__scrollViewTarget';

const useStyles = makeStyles({
    root: {
        overflow: 'auto',
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

interface IScrollViewProps {
    children: React.ReactChild;
    className?: string;
    style?: React.CSSProperties;
    center?: boolean;
}

export const ScrollView = ({
    children,
    className,
    style,
    center = false,
}: IScrollViewProps) => {
    const classes = useStyles();
    return (
        <div className={className} style={style}>
            <AutoSizer className={classNames(classes.root, SCROLL_VIEW_TARGER)}>
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
