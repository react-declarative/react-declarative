import * as React from 'react';
import { useState, useEffect, useMemo } from 'react';

import { BrowserHistory, Location, Update } from 'history';
import { Key } from 'path-to-regexp';

import { createBrowserHistory } from 'history';
import { pathToRegexp } from 'path-to-regexp';

import FetchView, { IFetchViewProps } from '../FetchView';

import ForbiddenDefault from './components/Forbidden';
import NotFoundDefault from './components/NotFound';
import LoaderDefault from './components/Loader';
import ErrorDefault from './components/Error';

export interface ISwitchItem {
    path: string;
    element?: React.ComponentType<any>;
    guard?: () => boolean | Promise<boolean>;
    prefetch?: (params?: Record<string, any>) => Record<string, any> | Promise<Record<string, any>>;
    redirect?: string;
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
}: ISwitchProps) => {

    const [location, setLocation] = useState<Location>({
        ...history.location,
    });

    useEffect(() => {
        const handleLocation = ({ location }: Update) => {
            const newLocation = { ...location };
            setLocation(newLocation);
        };
        return history.listen(handleLocation);
    }, [history]);

    const handleState = useMemo(() => async () => {
        const { pathname: url = '/' } = location;
        for (const item of items) {

            const {
                element = Fragment,
                redirect,
                prefetch,
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

            if (match) {
                if (await canActivate(item)) {
                    if (redirect) {
                        setTimeout(() => {
                            setLocation((location) => ({
                                ...location,
                                pathname: redirect,
                            }));
                        });
                        return {
                            element: Fragment,
                        };
                    }
                    buildParams();
                    prefetch && Object.assign(params, await prefetch(params));
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
        >
            {(data: Record<string, any>) => {
                const { element: Element = Fragment, params } = data;
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
