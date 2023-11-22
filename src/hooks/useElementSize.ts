import { useState, useRef, useLayoutEffect } from "react";

import useActualValue from "./useActualValue";

import debounce from "../utils/hof/debounce";

interface ISize {
    height: number;
    width: number;
}

interface IParams extends ISize {
    target?: HTMLElement | null;
    closest?: string;
    selector?: string;
    debounce?: number;
    compute?: (size: ISize) => ISize; 
    onResize?: (size: ISize) => void;
}

export const useElementSize = <T extends HTMLElement>({
    target = null,
    closest,
    selector,
    height = 0,
    width = 0,
    debounce: delay = 0,
    compute = (size) => size,
    onResize,
}: Partial<IParams> = {}) => {

    const elementRef = useRef<T>(null);
    const isMounted = useRef(true);

    useLayoutEffect(() => () => {
        isMounted.current = false;
    }, [])

    const [size, setSize] = useState<ISize>({
        height,
        width,
    });

    const size$ = useActualValue(size);

    useLayoutEffect(() => {

        const { current } = elementRef;
        let element = target || current;

        if (!element) {
            return;
        }

        if (closest) {
            element = element?.closest(closest) || null;
          }
      
        if (selector) {
            element = element?.querySelector(selector) || null;
        }

        if (!element) {
            return;
        }

        const handler = debounce((pendingSize : ISize) => {
            pendingSize = compute(pendingSize);
            pendingSize.height = Math.floor(pendingSize.height);
            pendingSize.width = Math.floor(pendingSize.width);
            const { current: size } = size$;
            if (size.height !== pendingSize.height || size.width !== pendingSize.width) {
                isMounted.current && setSize(pendingSize);
                onResize && onResize(pendingSize);
            }
        }, delay);

        const observer = new ResizeObserver(() => {
            const { height, width } = element!.getBoundingClientRect();
            handler({ height, width });
        });

        let pendingSize = compute({ ...element.getBoundingClientRect() });
        pendingSize.height = Math.floor(pendingSize.height);
        pendingSize.width = Math.floor(pendingSize.width);
        
        setSize(pendingSize);

        observer.observe(element);

        return () => {
            observer.disconnect();
            handler.clear();
        };
    }, [
        elementRef.current,
        target,
        closest,
        selector,
    ]);

    return {
        elementRef,
        size,
    };
};

export default useElementSize;
