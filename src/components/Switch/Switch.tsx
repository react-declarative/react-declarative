import * as React from 'react';
import { useState, useEffect, useMemo } from 'react';

import { BrowserHistory, Location } from 'history';
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
}: ISwitchProps) => {

    const [location, setLocation] = useState<Location>({
        ...history.location,
    });

    useEffect(() => {
        const handleLocation = () => setLocation({ ...history.location });
        handleLocation();
        return history.listen(handleLocation);
    }, [history, items]);

    const handleState = useMemo(() => async () => {
        const { pathname: url } = location;
        for (const item of items) {

            const {
                element = Fragment,
                redirect,
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
                        history.push(redirect);
                        return {
                            element: Fragment,
                        };
                    }
                    buildParams();
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
    }, [items, location]);

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
