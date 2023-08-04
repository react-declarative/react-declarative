import { useState, useRef, useLayoutEffect } from "react";

type Height = Exclude<React.CSSProperties['height'], undefined>;
type Width = Exclude<React.CSSProperties['width'], undefined>;

interface ISize {
    height: Height;
    width: Width;
}

export const useElementSize = <T extends HTMLElement>({
    height = 0,
    width = 0,
}: Partial<ISize> = {}) => {

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

        const { current: element } = elementRef;

        if (!element) {
            return;
        }

        const observer = new ResizeObserver(() => {
            requestAnimationFrame(() => {
                const { height, width } = element.getBoundingClientRect();
                isMounted.current && setSize({ height, width });
            });
        });

        observer.observe(element);

        return () => observer.disconnect();
    }, [
        elementRef.current
    ]);

    return {
        elementRef,
        size,
    };
};

export default useElementSize;
