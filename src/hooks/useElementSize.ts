import { useState, useRef, useLayoutEffect } from "react";

import useActualValue from "./useActualValue";

import debounce from "../utils/hof/debounce";

/**
 * Represents the size of an object or element.
 *
 * @interface
 */
interface ISize {
    height: number;
    width: number;
}

/**
 * Represents the parameters used by a class.
 *
 * @template Size - The size type used in the class.
 *
 * @property {ISize} [defaultSize] - The default size to be used if size is not provided.
 * @property [target] - The target element for the operation.
 * @property [closest] - The closest element selector.
 * @property [selector] - The element selector.
 * @property [debounce] - The debounce time in milliseconds.
 * @property [compute] - The function used to compute the size.
 * @property [onResize] - The callback function to be executed on resize.
 */
interface IParams<Size extends ISize> {
    defaultSize?: ISize;
    target?: HTMLElement | null;
    closest?: string;
    selector?: string;
    debounce?: number;
    compute?: (size: ISize) => Size; 
    onResize?: (size: Size) => void;
}

/**
 * Calculates the size of an HTML element and updates it when it changes.
 *
 * @template T - The type of the HTML element.
 * @template Size - The interface defining the size object type.
 *
 * @typedef  ISize - The interface defining the size object type.
 *
 * @typedef IParams - The interface defining the optional parameters for the useElementSize function.
 * @property defaultSize - The default size of the element.
 * @property target - The target element to calculate the size for. If not provided, the component's element will be used.
 * @property closest - The selector for the closest ancestor element.
 * @property selector - The selector for a specific descendant element.
 * @property debounce - The debounce delay in milliseconds for resizing events. Defaults to 0 (no debounce).
 * @property compute - A function to compute the size object based on the raw size object. Defaults to a simple type casting.
 * @property onResize - A callback function called when the element size changes.
 *
 * @param options - The optional parameters for the useElementSize function.
 * @returns - An object containing a ref to the element and the current size.
 */
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
