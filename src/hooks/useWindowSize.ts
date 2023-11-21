import { useCallback, useEffect, useState } from 'react';
import ISize from '../model/ISize';
import debounce from '../utils/hof/debounce';
import useActualValue from './useActualValue';

const RESIZE_DEBOUNCE = 10;

interface IParams {
    debounce: number;
    compute: (size: ISize) => ISize;
}

export const useWindowSize = ({
    debounce: delay = RESIZE_DEBOUNCE,
    compute = (size) => size,
}: Partial<IParams> = {}) => {
    
    const getWindowSize = useCallback(() => {
        const size = compute({
            height: Math.floor(window.innerHeight),
            width: Math.floor(window.innerWidth),
        });
        size.height = Math.floor(size.height);
        size.width = Math.floor(size.width);
        return (size);
    }, [])

    const [size, setSize] = useState<ISize>(getWindowSize);

    const size$ = useActualValue(size);

    useEffect(() => {
        const handler = debounce(() => {
            const { current: currentSize } = size$;
            const pendingSize = getWindowSize();
            if (currentSize.height !== pendingSize.height || currentSize.width !== pendingSize.width) {
                setSize(pendingSize);
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
