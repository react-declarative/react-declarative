import * as React from 'react';

import { makeStyles } from '../../../styles';

import classNames from '../../../utils/classNames';

import AutoSizer from '../AutoSizer';

const useStyles = makeStyles({
    root: {
        position: 'relative',
    },
    scrollY: {
        overflowX: 'hidden',
        overflowY: 'auto',
    },
    scrollXY: {
        overflowX: 'auto',
        overflowY: 'auto',
    },
    container: {
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
    scrollX?: boolean;
}

export const ScrollView = ({
    children,
    className,
    style,
    center = false,
    scrollX = false,
}: IScrollViewProps) => {
    const classes = useStyles();
    return (
        <AutoSizer className={className} style={style}>
            {({ height, width }) => (
                <div className={classNames(classes.root, {
                    [classes.scrollXY]: scrollX,
                    [classes.scrollX]: !scrollX,
                })} style={{ height, width }}>
                    <div
                        className={classNames(classes.container, {
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
    );
};

export default ScrollView;
