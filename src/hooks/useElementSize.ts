import { useState, useRef, useLayoutEffect } from "react";

interface ISize {
    height: number;
    width: number;
}

interface IParams extends ISize {
    target?: HTMLElement | null;
    closest?: string;
    selector?: string;
    compute?: (size: ISize) => ISize; 
    onResize?: (size: ISize) => void;
}

export const useElementSize = <T extends HTMLElement>({
    target = null,
    closest,
    selector,
    height = 0,
    width = 0,
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

        const observer = new ResizeObserver(() => {
            requestAnimationFrame(() => {
                const { height, width } = element!.getBoundingClientRect();
                const size = compute({ height, width });
                isMounted.current && setSize(size);
                onResize && onResize(size);
            });
        });

        observer.observe(element);

        return () => observer.disconnect();
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
