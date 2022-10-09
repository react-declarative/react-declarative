import React from 'react';

import { useState, useRef, useEffect, useLayoutEffect } from 'react';

import { makeStyles } from '../../../styles';

import IAnything from '../../../model/IAnything';

import classNames from '../../../utils/classNames';

export interface IRenderParams {
    style: React.CSSProperties;
    index: number;
}

export interface IScrollParams {
    scrollOffset: number;
    direction: 'up' | 'down';
}

export const SCROLL_WRAPPER = 'react-declarative__vlistWrapper';
const SCROLL_EVENT_DELAY = 1_000;

/**
 * @see https://github.com/nishanbajracharya/react-virtualized-listview/blob/master/src/index.js
 */

interface IVirtualizedListProps<RowData extends IAnything> {
    rows?: RowData[];
    overScanCount?: number;
    children: (params: IRenderParams) => React.ReactElement;
    getItemSize?: (idx: number) => number;
    className?: string;
    style?: React.CSSProperties;
    itemSize: number;
    height: number;
    width: number;
    onScroll?: (params: IScrollParams) => void;
}

interface IState {
    scrollTop: number;
    visibleHeight: number;
    mapHeight: Record<number, {
        top: number;
        height: number;
    }>,
    maxRowHeight: number;
    totalHeight: number;
}

const useStyles = makeStyles()({
    container: {
        position: 'relative',
    },
    listWrapper: {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflowY: 'auto',
        position: 'absolute'
    },
})

export const VirtualizedList = <Data extends IAnything>({
    rows = [],
    overScanCount = 5,
    itemSize = 75,
    getItemSize = () => itemSize,
    children: renderItem,
    className,
    style = {},
    height,
    width,
    onScroll = () => null,
}: IVirtualizedListProps<Data>) => {

    const { classes } = useStyles();

    const listWrapperRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLDivElement>(null);

    const [state, setState] = useState<IState>({
        scrollTop: 0,
        visibleHeight: 0,
        mapHeight: {},
        maxRowHeight: 0,
        totalHeight: 0
    });

    useEffect(() => {
        const mapHeight = {};
        let totalHeight = 0;
        let maxRowHeight = 0;
        let top = 0;
        if (rows.length !== Object.keys(state.mapHeight).length) {
            for (let index = 0; index !== rows.length; index++) {
                const height = getItemSize(index);
                mapHeight[index] = {
                    height,
                    top,
                };
                top += height;
                totalHeight += height;
                maxRowHeight = maxRowHeight > height ? maxRowHeight : height;
            }
            setState((prevState) => ({
                ...prevState,
                mapHeight,
                totalHeight,
                maxRowHeight
            }));
        }

    }, [rows, overScanCount]);

    useLayoutEffect(() => {
        const { current: wrapper } = listWrapperRef;
        if (wrapper) {
            const visibleHeight = parseFloat(
                window.getComputedStyle(wrapper, null).getPropertyValue('height')
            );
            let prevScrollTop = wrapper.scrollTop;
            let scollEmitTimeout: any = null;
            const handleScroll = (event: any) => {
                const { scrollTop, scrollHeight, clientHeight } = event.target;
                setState((prevState) => ({
                    ...prevState,
                    scrollTop,
                }));
                scollEmitTimeout = setTimeout(() => onScroll({
                    direction: scrollTop > prevScrollTop ? 'down' : 'up',
                    scrollOffset: scrollHeight - scrollTop - clientHeight,
                }), SCROLL_EVENT_DELAY)
                prevScrollTop = scrollTop;
            };
            setState((prevState) => ({ ...prevState, visibleHeight }));
            wrapper.addEventListener('scroll', handleScroll, true);
            return () => {
                wrapper.removeEventListener('scroll', handleScroll);
                scollEmitTimeout && clearTimeout(scollEmitTimeout);
            };
        } else {
            console.warn('VirtualizedList undefined wrapper');
            return () => null;
        }
    }, [onScroll]);

    const checkIfVisible = (index: number) => {
        if (!state.mapHeight[index]) {
            return false;
        }
        const elemPosition = state.mapHeight[index].top;
        return (
            elemPosition >
            state.scrollTop -
            overScanCount * state.maxRowHeight &&
            elemPosition <
            state.scrollTop +
            state.visibleHeight +
            overScanCount * state.maxRowHeight
        );
    };

    return (
        <div
            style={{...style, height, width}}
            className={classNames(className, classes.container)}
            ref={containerRef}
        >
            <div className={classNames(classes.listWrapper, SCROLL_WRAPPER)} ref={listWrapperRef}>
                <div style={{
                    height: state.totalHeight,
                    position: 'relative',
                }} ref={listRef}>
                    {rows.map((_, index) => {
                        const { height, top } = state.mapHeight[index] || {};
                        if (checkIfVisible(index)) {
                            return renderItem({
                                index: index,
                                style: {
                                    height: height,
                                    left: 0,
                                    right: 0,
                                    top: top,
                                    position: 'absolute'
                                },
                            });
                        } else {
                            return null;
                        }
                    })}
                </div>
            </div>
        </div>
    );
};

export default VirtualizedList;
