import { useEffect, useRef } from 'react';

const Destructor = () => { };

export const useChange = (effect: React.EffectCallback, deps?: React.DependencyList) => {

    const initialChange = useRef(true);

    useEffect(() => {
        if (initialChange.current) {
            initialChange.current = false;
            return Destructor;
        } else {
            return effect() || Destructor;
        }
    }, deps);

};

export default useChange;
