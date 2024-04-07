import { useCallback, useEffect, useState } from 'react';
import ISize from '../model/ISize';
import debounce from '../utils/hof/debounce';
import useActualValue from './useActualValue';

const RESIZE_DEBOUNCE = 10;

/**
 * Represents a set of parameters with generic size and optional resize event handler.
 * @interface
 * @template Size - The type of the size the parameters can compute and resize to.
 */
interface IParams<Size extends ISize> {
    debounce: number;
    compute: (size: ISize) => Size;
    onResize?: (size: Size) => void;
}

/**
 * Returns the size of the window.
 * @template Size - The type of the size object.
 * @param [options] - Optional configuration options.
 * @param [options.debounce] - The delay in milliseconds for debouncing the resize event. Default is `RESIZE_DEBOUNCE`.
 * @param [options.compute] - A function that computes the size object from the window size. Default is `(size) => size as Size`.
 * @param [options.onResize] - A callback function to be called when the window size changes.
 * @returns The size of the window.
 */
export const useWindowSize = <Size extends ISize = ISize>({
    debounce: delay = RESIZE_DEBOUNCE,
    compute = (size) => size as Size,
    onResize,
}: Partial<IParams<Size>> = {}) => {
    
    /**
     * Retrieves the current window size.
     *
     * @returns The size of the window.
     *                   - height: The height of the window as a whole number.
     *                   - width: The width of the window as a whole number.
     */
    const getWindowSize = useCallback(() => {
        const size = compute({
            height: Math.floor(window.innerHeight),
            width: Math.floor(window.innerWidth),
        });
        size.height = Math.floor(size.height);
        size.width = Math.floor(size.width);
        return size;
    }, [])

    const [size, setSize] = useState<Size>(getWindowSize);

    const size$ = useActualValue(size);

    useEffect(() => {
        const handler = debounce(() => {
            const { current: currentSize } = size$;
            const pendingSize = getWindowSize();
            if (currentSize.height !== pendingSize.height || currentSize.width !== pendingSize.width) {
                setSize(pendingSize);
                onResize && onResize(pendingSize);
            }
        }, delay);
        window.addEventListener('resize', handler);
        return () => {
            window.removeEventListener('resize', handler);
            handler.clear();
        };
    }, []);

    return size;
};

export default useWindowSize;
