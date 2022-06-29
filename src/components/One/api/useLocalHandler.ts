import { useEffect, useState } from 'react';

import IOneProps, { 
    OneHandler,
} from "../../../model/IOneProps";

import IAnything from "../../../model/IAnything";

export interface ILocalHandlerParams<Data extends IAnything = IAnything> {
    resultMap?: (json: Record<string, any> | null) => Data | null;
    onLoadBegin?: () => void;
    onLoadEnd?: (isOk: boolean) => void;
    fallback?: (e: Error) => void;
}

export interface ILocalHandlerResult<Data extends IAnything = IAnything> {
    data: Data | null;
    change: IOneProps<Data>['change'];
}

const EMPTY_RESPONSE = null;

const resolveHandler = async <Data = IAnything>(handler: OneHandler<Data>): Promise<Data | null> => {
    if (typeof handler === 'function') {
        const result = (handler as Function)();
        return result instanceof Promise ? (await result) : result;
    } else {
        return handler;
    }
};

export const useLocalHandler = <Data extends IAnything = IAnything>(handler: OneHandler<Data>, {
    resultMap = (data) => data as Data,
    onLoadBegin,
    onLoadEnd,
    fallback,
}: ILocalHandlerParams<Data> = {}): ILocalHandlerResult<Data> => {

    const [data, setData] = useState<Data | null>(null);

    useEffect(() => {
        const process = async () => {
            onLoadBegin && onLoadBegin();
            let isOk = true;
            try {
                const data = await resolveHandler<Data>(handler);
                setData(resultMap((data || {}) as Record<string, any>));
            } catch (e) {
                isOk = false;
                if (fallback) {
                    fallback(e as Error);
                    setData(EMPTY_RESPONSE);
                } else {
                    throw e;
                }
            } finally {
                onLoadEnd && onLoadEnd(isOk);
            }
        };
        process();
    }, []);

    const change = (data: Data, initial: boolean) => {
        if (!initial) {
            setData(data);
        }
    };

    return {
        data,
        change,
    };
};

export default useLocalHandler;
