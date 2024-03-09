import { useState, useRef, useLayoutEffect } from "react";

import useActualValue from "./useActualValue";

import debounce from "../utils/hof/debounce";

interface ISize {
    height: number;
    width: number;
}

interface IParams<Size extends ISize> {
    defaultSize?: ISize;
    target?: HTMLElement | null;
    closest?: string;
    selector?: string;
    debounce?: number;
    compute?: (size: ISize) => Size; 
    onResize?: (size: Size) => void;
}

export const useElementSize = <T extends HTMLElement, Size extends ISize = ISize>({
    defaultSize: {
        height,
        width,
    } = {
        height: 0,
        width: 0,
    },
    target = null,
    closest,
    selector,
    debounce: delay = 0,
    compute = (size) => size as Size,
    onResize,
}: Partial<IParams<Size>> = {}) => {

    const elementRef = useRef<T>(null);
    const isMounted = useRef(true);

    useLayoutEffect(() => () => {
        isMounted.current = false;
    }, [])

    const [size, setSize] = useState<Size>({
        height,
        width,
    } as Size);

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
            let mappedSize = {...compute(pendingSize)};
            mappedSize.height = Math.floor(mappedSize.height);
            mappedSize.width = Math.floor(mappedSize.width);
            const { current: size } = size$;
            if (size.height !== mappedSize.height || size.width !== mappedSize.width) {
                isMounted.current && setSize(mappedSize);
                onResize && onResize(mappedSize);
            }
        }, delay);

        const observer = new ResizeObserver(() => {
            const { height, width } = element!.getBoundingClientRect();
            handler({ height, width });
        });

        let pendingSize = {...compute({ ...element.getBoundingClientRect() })};
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
