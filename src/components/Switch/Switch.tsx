import * as React from 'react';
import { useState, useEffect, useMemo, useRef } from 'react';

import { BrowserHistory, HashHistory, Location, MemoryHistory, Update } from 'history';
import { Key } from 'path-to-regexp';

import { pathToRegexp } from 'path-to-regexp';

import FetchView, { IFetchViewProps } from '../FetchView';

import ForbiddenDefault from './components/Forbidden';
import NotFoundDefault from './components/NotFound';
import LoaderDefault from './components/Loader';
import ErrorDefault from './components/Error';

import createWindowHistory from '../../utils/createWindowHistory';
import sleep from '../../utils/sleep';

export interface ISwitchItem {
    path: string;
    element?: React.ComponentType<any>;
    guard?: () => boolean | Promise<boolean>;
    prefetch?: (params: Record<string, any>) => Record<string, any> | Promise<Record<string, any>>;
    unload?: (params: Record<string, any>) =>  (Promise<void> | void); 
    redirect?: string | ((params: Record<string, any>) => string | null);
}

export interface ISwitchProps {
    className?: string;
    style?: React.CSSProperties;
    items: ISwitchItem[];
    fallback?: (e: Error) => void;
    history?: BrowserHistory | MemoryHistory | HashHistory;
    Forbidden?: React.ComponentType<any>;
    NotFound?: React.ComponentType<any>;
    Loader?: React.ComponentType<any>;
    Error?: React.ComponentType<any>;
    animation?: IFetchViewProps['animation'];
    onLoadStart?: () => void;
    onLoadEnd?: (isOk?: boolean) => void;
    onInit?: () => void;
    onDispose?: () => void;
    throwError?: boolean;
    children?: (result: ISwitchResult) => React.ReactNode;
}

const canActivate = async (item: ISwitchItem) => {
    const { guard = () => true } = item;
    const isAvailable = guard();
    if (isAvailable instanceof Promise) {
        return await isAvailable;
    } else {
        return isAvailable;
    }
};

interface ISwitchResult {
    element: React.ComponentType<any>;
    path: string;
    params?: Record<string, any>; 
}

const DEFAULT_HISTORY = createWindowHistory();

const DEFAULT_CHILD_FN = ({
    element: Element = Fragment,
    params
}: ISwitchResult) => (
    <Element
        {...params}
    />
);

const Fragment = () => <></>;

export const Switch = ({
    className,
    style,
    Loader = LoaderDefault,
    Forbidden = ForbiddenDefault,
    NotFound = NotFoundDefault,
    Error = ErrorDefault,
    animation,
    history = DEFAULT_HISTORY,
    children = DEFAULT_CHILD_FN,
    fallback,
    items,
    onLoadStart,
    onLoadEnd,
    onInit = () => undefined,
    onDispose = () => undefined,
    throwError = false,
}: ISwitchProps) => {

    const [initComplete, setInitComplete] = useState(false);

    const unloadRef = useRef<(() => Promise<void>) | null>(null);

    const [location, setLocation] = useState<Location>({
        ...history.location,
    });

    const handleInit = async () => {
        let isOk = true;
        onLoadStart && onLoadStart();
        try {
            await onInit();
        } catch (e) {
            isOk = false;
            if (!throwError) {
                fallback && fallback(e as Error);
            } else {
                throw e;
            }
        } finally {
            onLoadEnd && onLoadEnd(isOk);
            setInitComplete(true);
        }
    };

    const handleDispose = async () => {
        let isOk = true;
        onLoadStart && onLoadStart();
        try {
            await onDispose();
        } catch (e) {
            isOk = false;
            if (!throwError) {
                fallback && fallback(e as Error);
            } else {
                throw e;
            }
        } finally {
            onLoadEnd && onLoadEnd(isOk);
        }
    };

    useEffect(() => {
        handleInit();
        return () => {
            handleDispose();
        };
    }, []);

    useEffect(() => {
        const handleLocation = (update: Update) => {
            if (update.location.pathname !== location.pathname) {
                const newLocation = { ...update.location };
                setLocation(newLocation);
            }
        };
        return history.listen(handleLocation);
    }, [history, location]);

    const handleState = useMemo(() => async (): Promise<ISwitchResult> => {
        const { pathname: url = '/' } = location;
        unloadRef.current && await unloadRef.current();
        for (const item of items) {

            const {
                element = Fragment,
                redirect,
                prefetch,
                unload,
                path,
            } = item;

            const params: Record<string, unknown> = {};

            const keys: Key[] = [];
            const reg = pathToRegexp(path, keys);
            const match = reg.test(url);

            const buildParams = () => {
                const tokens = reg.exec(url);
                tokens && keys.forEach((key, i) => {
                    params[key.name] = tokens[i + 1];
                });
            };

            const provideUnloadRef = () => {
                if (unload) {
                    unloadRef.current = async () => {
                        await Promise.resolve(unload(params));
                        unloadRef.current = null;
                    };
                }
            };

            if (match) {
                if (await canActivate(item)) {
                    buildParams();
                    prefetch && Object.assign(params, await prefetch(params));
                    provideUnloadRef();
                    if (typeof redirect === 'string') {
                        setLocation((location) => ({
                            ...location,
                            pathname: redirect,
                        }));
                        return {
                            element: Fragment,
                            path,
                        };
                    }
                    if (typeof redirect === 'function') {
                        const result = redirect(params) || null;
                        if (result !== null) {
                            setLocation((location) => ({
                                ...location,
                                pathname: result,
                            }));
                            return {
                                element: Fragment,
                                path,
                            };
                        }
                    }
                    return {
                        element,
                        params,
                        path,
                    };
                }
                return {
                    element: Forbidden,
                    path,
                };
            }
        }
        return {
            element: NotFound,
            path: url,
        };
    }, [location]);

    if (!initComplete) {
        return (
            <Loader />
        );
    }

    return (
        <FetchView<Location, ISwitchResult>
            className={className}
            style={style}
            state={handleState}
            Loader={Loader}
            Error={Error}
            animation={animation}
            payload={location}
            fallback={fallback}
            onLoadStart={onLoadStart}
            onLoadEnd={onLoadEnd}
            throwError={throwError}
        >
            {async (data) => {
                /* delay to prevent sync execution for appear animation */
                await sleep(0);
                return children(data);
            }}
        </FetchView>
    );
};

export default Switch;
