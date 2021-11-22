import * as React from 'react';
import { useRef, useState, useLayoutEffect } from 'react';

import { debounce, makeStyles } from '@material-ui/core';

import classNames from '../utils/classNames';

import IField from '../model/IField';
import IEntity from '../model/IEntity';
import IAnything from '../model/IAnything';
import { PickProp } from '../model/IManaged';

import Group from '../components/common/Group';

const CENTER_DEBOUNCE = 500;

declare var ResizeObserver: any;

export interface ICenterLayoutProps<Data = IAnything> {
    innerPadding?: PickProp<IField<Data>, 'innerPadding'>;
    className?: PickProp<IField<Data>, 'className'>;
    style?: PickProp<IField<Data>, 'style'>;
}

interface ICenterLayoutPrivate<Data = IAnything> extends IEntity<Data> {
    children: React.ReactChild;
}

const useStyles = makeStyles({
    root: {
        position: 'relative',
        overflowY: 'auto',
        width: '100%',
        height: '100%',
        flex: 1,
    },
    container: {
        position: 'absolute',
        overflowX: 'hidden',
        top: 0,
        left: 0,
        right: 0,
        minHeight: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
    },
    content: {
        width: '100%',
    },
    hidden: {
        display: 'none',
    },
});

export const CenterLayout = <Data extends IAnything = IAnything>({
    children,
    className,
    style,
    innerPadding: padding = '0px',
}: ICenterLayoutProps<Data> & ICenterLayoutPrivate<Data>) => {
    const classes = useStyles();

    const groupRef = useRef<HTMLDivElement>(null);
    const [ initComplete, setInitComplete ] = useState(false);
    const [ marginRight, setMarginRight ] = useState(0);

    useLayoutEffect(() => {

        const { current: group } = groupRef;

        const handler = () => {
            if (group) {
                const { width, left } = group.getBoundingClientRect();
                let right = 0;
                group.querySelectorAll(':scope > *').forEach((el) => right = Math.max(right, el.getBoundingClientRect().right));
                right ? setMarginRight(Math.min(right - left - width, 0)) : setMarginRight(-1);
            }
        };

        const handlerD = debounce(handler, CENTER_DEBOUNCE);

        const mObserver = new MutationObserver(handlerD);
        const rObserver = new ResizeObserver(handlerD);

        if (group) {
            mObserver.observe(group, {
                childList: true,
                subtree: true,
            });
            rObserver.observe(group);
            setTimeout(handler, CENTER_DEBOUNCE / 2);
        };

        return () => {
            handlerD.clear();
            mObserver.disconnect();
            group && rObserver.unobserve(group);
            rObserver.disconnect();
        };
    }, []);

    useLayoutEffect(() => {
        marginRight && setInitComplete(true)
    }, [marginRight]);

    return (
        <div className={classNames(classes.root, className)} style={style}>
            <div className={classes.container} style={{ padding }}>
                <div
                    className={classNames(classes.content, {
                        [classes.hidden]: !initComplete,
                    })}
                    style={{
                        marginRight: marginRight !== -1 ? marginRight : 'unset',
                    }}
                >
                    <Group ref={groupRef}>
                        {children}
                    </Group>
                </div>
            </div>
        </div>
    );    
};

CenterLayout.displayName = 'CenterLayout';

export default CenterLayout;
