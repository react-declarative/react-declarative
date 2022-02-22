import * as React from 'react';
import { useRef, useState, useLayoutEffect } from 'react';

import Sha from 'sha.js';

import { makeStyles } from '../styles';
import { debounce } from '@mui/material';

import classNames from '../utils/classNames';

import IField from '../model/IField';
import IEntity from '../model/IEntity';
import IAnything from '../model/IAnything';
import { PickProp } from '../model/IManaged';

import Group from '../components/common/Group';
import getXPathFromElement from '../utils/getXPathFromElement';

const CENTER_DEBOUNCE = 250;

declare var ResizeObserver: any;

export interface ICenterLayoutProps<Data = IAnything> {
    centerKeepFlow?: PickProp<IField<Data>, 'centerKeepFlow'>;
    innerPadding?: PickProp<IField<Data>, 'innerPadding'>;
    className?: PickProp<IField<Data>, 'className'>;
    style?: PickProp<IField<Data>, 'style'>;
}

interface ICenterLayoutPrivate<Data = IAnything> extends IEntity<Data> {
    children: React.ReactChild;
}

type minHeightT = PickProp<React.CSSProperties, 'minHeight'>;

const useStyles = makeStyles({
    root: {
        position: 'relative',
        minWidth: 1,
        overflowY: 'auto',
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
    keepFlow: {
        position: 'static',
        '& $container': {
            position: 'static',
        },
    },
});

const marginManager = new class {

    private readonly storage = new Map<string, number>();

    private readonly getElementHash = (element: HTMLElement) => {
        const xpath = getXPathFromElement(element);
        if (xpath) {
            return Sha('sha1').update(xpath).digest('hex');
        } else {
            return '';
        }
    };

    getValue = (element: HTMLElement) => {
        const hash = this.getElementHash(element);
        return this.storage.get(hash) || 0;
    };

    setValue(element: HTMLElement, marginRight: number) {
        const hash = this.getElementHash(element);
        hash && this.storage.set(hash, marginRight);
    };

}();

export const CenterLayout = <Data extends IAnything = IAnything>({
    children,
    className,
    style,
    centerKeepFlow: keepFlow = true,
    innerPadding: padding = '0px',
}: ICenterLayoutProps<Data> & ICenterLayoutPrivate<Data>) => {
    const classes = useStyles();

    const groupRef = useRef<HTMLDivElement>(null);
    const rootRef = useRef<HTMLDivElement>(null);

    const [marginRight, setMarginRight] = useState(0);
    const [minHeight, setMinHeight] = useState<minHeightT>(0);

    const isMounted = useRef(true);

    useLayoutEffect(() => () => {
        isMounted.current = false;
    }, []);

    useLayoutEffect(() => {
        const { current: root } = rootRef;
        if (root && keepFlow) {
            const { minHeight } = getComputedStyle(root);
            setMinHeight(minHeight);
        }
    }, [keepFlow]);

    useLayoutEffect(() => {

        const { current: group } = groupRef;

        const handler = () => {
            if (group && isMounted.current) {
                const { width, left } = group.getBoundingClientRect();
                let right = 0;
                group.querySelectorAll(':scope > *').forEach((el) => right = Math.max(right, el.getBoundingClientRect().right));
                const marginRight = Math.min(right - left - width, 0);
                marginManager.setValue(group, marginRight);
                setMarginRight(marginRight);
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
            window.addEventListener('resize', handlerD);
            handler();
        };

        return () => {
            handlerD.clear();
            mObserver.disconnect();
            group && rObserver.unobserve(group);
            window.removeEventListener('resize', handlerD);
            rObserver.disconnect();
        };
    }, []);

    useLayoutEffect(() => {
        const { current: group } = groupRef;
        if (group) {
            setMarginRight(marginManager.getValue(group));
        }
    }, []);

    return (
        <div ref={rootRef} className={classNames(classes.root, className, {
            [classes.keepFlow]: keepFlow,
        })} style={style}>
            <div className={classes.container} style={{ padding, minHeight }}>
                <div
                    className={classes.content}
                    style={{ marginRight }}
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
