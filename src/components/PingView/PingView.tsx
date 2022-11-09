import * as React from 'react';
import { useState, useEffect } from 'react';

interface IPingViewProps<P extends any = object> {
    children?: React.ReactNode;
    Offline?: React.ComponentType<any>;
    ping: (payload?: P) => (boolean | Promise<boolean>);
    fallback?: (e: Error) => void;
    throwError?: boolean;
    delay?: 5_000;
    payload?: P;
    onOnline?: () => void;
    onOffline?: () => void;
}

interface IState {
    isOnline: boolean;
    initComplete: boolean;
}

const Fragment = () => <></>;

export const PingView = <P extends any = object>({
    ping,
    children,
    onOnline = () => null,
    onOffline = () => null,
    Offline = Fragment,
    fallback,
    throwError,
    delay = 5_000,
    payload,
}: IPingViewProps<P>) => {

    const [state, setState] = useState<IState>({
        isOnline: false,
        initComplete: false,
    });

    const setIsOnline = (isOnline: boolean) => {
        setState({ initComplete: true, isOnline });
        isOnline ? onOnline() : onOffline();
    };

    useEffect(() => {
        let timeout: any = null;
        let isDisposed = false;
        const process = async () => {
            try {
                const isOnline = await ping(payload);
                if (isDisposed) {
                    return;
                }
                setIsOnline(!!isOnline);
            } catch (e) {
                !isDisposed && setIsOnline(false);
                if (throwError) {
                    throw e;
                } else {
                    fallback && fallback(e as Error);
                }
            } finally {
                timeout = setTimeout(process, delay);
            }
        };
        process();
        return () => {
            isDisposed = true;
            if (timeout !== null) {
                clearTimeout(timeout);
            }
        };
    }, [payload]);

    if (state.initComplete) {
        if (state.isOnline) {
            return (
                <>
                    {children}
                </>
            );
        } else {
            return (
                <Offline />
            );
        }
    } else {
        return null;
    }
};

export default PingView;
