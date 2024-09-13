import * as React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';

import useActualValue from '../../../hooks/useActualValue';
import useAsyncValue from '../../../hooks/useAsyncValue';
import useSingleton from "../../../hooks/useSingleton";

import useProps from './useProps';

import Subject from "../../../utils/rx/Subject";

import createValueProvider from "../../../utils/createValueProvider";
import createSsManager from '../../../utils/createSsManager';
import sleep from '../../../utils/sleep';
import not from '../../../utils/math/not';

import { RowId } from "../../../model/IRowData";

const [IntersectionContext, useIntersectionContext] = createValueProvider<IntersectionManager>();

const SCROLL_ROWS_DELAY = 100;
const SCROLL_KEEP_DELAY = 100;

const SCROLL_APPLY_DELAY = 250;
const SCROLL_APPLY_ITERS = 20;

const POSITIVE_INFINITY = 9999999999;
const NEGATIVE_INFINITY = -9999999999;

const getMiddle = (num1: number, num2: number) => {
    return Math.floor((num1 + num2) / 2) - 1;
};

interface IIntersectionProviderProps {
    children: React.ReactNode;
}

const storageManger = createSsManager<RowId>("LIST_RESTORE_POS_ID");

declare global {
    interface IntersectionObserverEntry {
        isVisible: boolean;
    }
}

class IntersectionManager {

    readonly reloadSubject = new Subject<[RowId, boolean]>();

    idMap = new Map<HTMLElement, RowId>();
    viewportMap = new Map<RowId, boolean>();
    visibleMap = new Map<RowId, boolean>();

    isListening = true;

    getIsVisible = (id: RowId) => !!this.viewportMap.get(id);
    getElementCount = () => this.idMap.size;

    constructor (public readonly withRestorePos: boolean) { }

    intersectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            const target = entry.target as HTMLElement;
            const id = this.idMap.get(target);
            if (!id) {
                console.error("List IntersectionManager id is undefined");
                return;
            }
            this.viewportMap.set(id, entry.isIntersecting);
            this.visibleMap.set(id, entry.isVisible || entry.isIntersecting);
            this.reloadSubject.next([id, entry.isIntersecting]);
        });
    });

    observe = (id: RowId, element: HTMLElement) => {
        if (!this.withRestorePos) {
            return;
        }
        this.intersectionObserver.observe(element);
        this.idMap.set(element, id);
        this.viewportMap.set(id, false);
        this.visibleMap.set(id, false);
    };

    unobserve = (id: RowId, element: HTMLElement) => {
        if (!this.withRestorePos) {
            return;
        }
        this.idMap.delete(element);
        this.viewportMap.delete(id);
        this.visibleMap.delete(id);
    };

    scrollIntoView = async (id: RowId) => {
        for (let i = 0; i !== SCROLL_APPLY_ITERS; i++) {
            if (this.visibleMap.size && this.visibleMap.has(id)) {
                return true;
            }
            if (!this.visibleMap.size && this.viewportMap.has(id)) {
                return true;
            }
            const element = document.querySelector<HTMLElement>(`[data-intersectionid='${id}']`);
            element && element.scrollIntoView({
                block: "start",
            });
            await sleep(SCROLL_APPLY_DELAY);
        }
        return false;
    };

    disconnect = () => {
        this.intersectionObserver.disconnect();
        this.isListening = false;
    };

};

export const IntersectionProvider = ({
    children,
}: IIntersectionProviderProps) => {
    const { rows, withRestorePos } = useProps();

    const intersectionManager = useSingleton(() => new IntersectionManager(!!withRestorePos));
    const rows$ = useActualValue(rows);
    const isMounted = useRef(true);

    useEffect(() => () => {
        isMounted.current = false;
        intersectionManager.disconnect();
    }, []);

    const waitForRows = useCallback(async () => {
        while (true) {
            const elementCount = intersectionManager.getElementCount();
            if (!isMounted.current) {
                return;
            }
            if (elementCount !== 0 && elementCount >= rows$.current.length) {
                break;
            }
            await sleep(SCROLL_ROWS_DELAY);
        }
    }, []);

    useEffect(() => {
        if (!withRestorePos) {
            return undefined;
        }
        return intersectionManager.reloadSubject.debounce(SCROLL_KEEP_DELAY).connect(() => {
            let minIdx = POSITIVE_INFINITY;
            let maxIdx = NEGATIVE_INFINITY;
            for (const [rowId, intersecting] of intersectionManager.viewportMap.entries()) {
                if (!intersecting) {
                    continue;
                }
                if (intersectionManager.visibleMap.size && !intersectionManager.visibleMap.get(rowId)) {
                    continue;
                }
                const rowIdx = rows$.current.findIndex(({ id }) => id === rowId);
                if (rowIdx === -1) {
                    continue;
                }
                minIdx = Math.min(rowIdx, minIdx);
                maxIdx = Math.max(rowIdx, maxIdx);
            }
            const middleIdx = getMiddle(minIdx, maxIdx);
            const row = rows$.current[middleIdx] || rows$.current[minIdx];
            row && storageManger.setValue(row.id);
        });
    });

    useAsyncValue(async () => {
        const id = storageManger.getValue();
        if (!withRestorePos || !id) {
            return;
        }
        await waitForRows();
        if (await not(intersectionManager.scrollIntoView(id))) {
            console.error(`List IntersectionProvider scrollIntoView failed: id=${id} not found`);
        }
    });

    return (
        <IntersectionContext payload={intersectionManager}>
            {children}
        </IntersectionContext>
    );
};

export const useIntersectionConnect = <T extends HTMLElement = HTMLElement>(id: RowId) => {
    const [ref, setRef] = useState<T | null>(null);
    const intersectionManager = useIntersectionContext();

    useEffect(() => {
        if (!ref) {
            return;
        }
        ref.dataset.intersectionid = String(id);
        intersectionManager.observe(id, ref);
        return () => intersectionManager.unobserve(id, ref);
    }, [ref]);

    return useCallback((ref: T | null) => {
        if (!intersectionManager.withRestorePos) {
            return;
        }
        if (ref) { ref.dataset.intersectionid = String(id); }
        setRef(ref);
    }, []);
};

export const useIntersectionListen = (id: RowId) => {
    const intersectionManager = useIntersectionContext();

    const [isVisible, setIsVisible] = useState(() => intersectionManager.getIsVisible(id));

    useEffect(() => intersectionManager.reloadSubject.subscribe(([elementId, isVisible]) => {
        if (id === elementId) {
            setIsVisible(isVisible);
        }
    }), []);

    if (!intersectionManager.withRestorePos) {
        return true;
    }

    return isVisible;
};

export const useIntersectionStorage = (): {
    getValue(): RowId | null;
    setValue(value: RowId | null): void;
} => storageManger;
