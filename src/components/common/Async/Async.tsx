import { useLayoutEffect, useRef, useState } from 'react';

type Result = JSX.Element | string | number | null;

interface IAsyncProps<T extends any = object> {
    children: (p: T) => (Result | Promise<Result>);
    fallback?: (e: Error) => void;
    params?: T;
}

export const Async = <T extends any = object>({
    children,
    fallback = () => null,
    params = {} as T,
}: IAsyncProps<T>) => {
    const [child, setChild] = useState<Result>(null);

    const isMounted = useRef(true);

    useLayoutEffect(() => () => {
      isMounted.current = false;
    }, []);

    useLayoutEffect(() => {
        const process = async () => {
            try {
                const newChild = await Promise.resolve(children(params!));
                isMounted.current && setChild(newChild);
            } catch(e) {
                fallback(e as Error);
            }
        };
        process();
    }, [children, fallback, params]);

    return child as JSX.Element;
};

export default Async;
