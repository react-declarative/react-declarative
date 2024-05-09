import { useEffect } from 'react';

export const useOnce = (fn: () => void) => {
    useEffect(fn, []);
};

export default useOnce;
