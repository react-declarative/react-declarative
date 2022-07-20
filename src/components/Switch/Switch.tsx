import * as React from 'react';
import { useState, useEffect, useMemo, useRef } from 'react';

import { BrowserHistory, Location, Update } from 'history';
import { Key } from 'path-to-regexp';

import { createBrowserHistory } from 'history';
import { pathToRegexp } from 'path-to-regexp';

import FetchView, { IFetchViewProps } from '../FetchView';

import ForbiddenDefault from './components/Forbidden';
import NotFoundDefault from './components/NotFound';
import LoaderDefault from './components/Loader';
import ErrorDefault from './components/Error';

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
    history?: BrowserHistory;
    Forbidden?: React.ComponentType<any>;
    NotFound?: React.ComponentType<any>;
    Loader?: React.ComponentType<any>;
    Error?: React.ComponentType<any>;
    animation?: IFetchViewProps['animation'];
    onLoadStart?: () => void;
    onLoadEnd?: (isOk?: boolean) => void;
    throwError?: boolean;
}

const canActivate = async (item: ISwitchItem) => {
    const { guard = () => true } = item;
    let isAvailable = guard();
    if (isAvailable instanceof Promise) {
        return await isAvailable;
    } else {
        return isAvailable;
    }
};

const defaultHistory = createBrowserHistory();

const Fragment = () => <></>;

export const Switch = ({
    className,
    style,
    Loader = LoaderDefault,
    Forbidden = ForbiddenDefault,
    NotFound = NotFoundDefault,
    Error = ErrorDefault,
    animation,
    history = defaultHistory,
    fallback,
    items,
    onLoadStart,
    onLoadEnd,
    throwError = false,
}: ISwitchProps) => {

    const unloadRef = useRef<(() => Promise<void>) | null>(null);

    const [location, setLocation] = useState<Location>({
        ...history.location,
    });

    useEffect(() => {
        const handleLocation = (update: Update) => {
            if (update.location.pathname !== location.pathname) {
                const newLocation = { ...update.location };
                setLocation(newLocation);
            }
        };
        return history.listen(handleLocation);
    }, [history, location]);

    const handleState = useMemo(() => async () => {
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
                        };
                    }
                    if (typeof redirect === 'function') {
                        const result = redirect(params);
                        if (result !== null) {
                            setLocation((location) => ({
                                ...location,
                                pathname: result,
                            }));
                            return {
                                element: Fragment,
                            };
                        }
                    }
                    return {
                        element,
                        params,
                    }
                }
                return {
                    element: Forbidden,
                }
            }
        }
        return {
            element: NotFound,
        }
    }, [location]);

    return (
        <FetchView<Location>
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
            {async (data: Record<string, any>) => {
                const { element: Element = Fragment, params } = data;
                /* delay to prevent sync execution for appear animation */
                await sleep(0);
                return (
                    <Element
                        {...params}
                    />
                );
            }}
        </FetchView>
    );
};

export default Switch;
