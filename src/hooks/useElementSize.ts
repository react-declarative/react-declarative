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
    delay?: number;
    compute?: (size: ISize) => ISize; 
    onResize?: (size: ISize) => void;
}

export const useElementSize = <T extends HTMLElement>({
    target = null,
    closest,
    selector,
    height = 0,
    width = 0,
    delay = 0,
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

        const handler = debounce(({ height, width } : ISize) => {
            const { current: size } = size$;
            if (size.height !== height || size.width !== width) {
                const size = compute({ height, width });
                isMounted.current && setSize(size);
                onResize && onResize(size);
            }
        }, delay);

        const observer = new ResizeObserver(() => {
            const size = element!.getBoundingClientRect();
            handler(size);
        });

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
