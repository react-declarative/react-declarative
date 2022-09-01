import * as React from 'react';
import { useState } from 'react';

import { makeStyles } from '../../styles';

import Async, { IAsyncProps } from '../Async';

import { LoaderPlaceholder } from './components/Placeholder';
import { ErrorPlaceholder } from './components/Placeholder';
import Reveal, { IRevealProps } from './components/Reveal';

import classNames from '../../utils/classNames';

export interface IFetchViewProps<P extends any = object, A = any, B = any, C = any, D = any, E = any> extends Omit<IAsyncProps<P>, keyof {
    children: never;
}> {
    animation?: IRevealProps['animation'];
    className?: string;
    style?: React.CSSProperties;
    state: ((payload: P) => readonly [Promise<A>?, Promise<B>?, Promise<C>?, Promise<D>?, Promise<E>?])
        | ((payload: P) => readonly [A?, B?, C?, D?, E?])
        | ((payload: P) => [Promise<A>?, Promise<B>?, Promise<C>?, Promise<D>?, Promise<E>?])
        | ((payload: P) => [A?, B?, C?, D?, E?])
        | ((payload: P) => Promise<A>)
        | ((payload: P) => A);
    children: (a: A, b: B, c: C, d: D, e: E) => React.ReactNode;
};

const useStyles = makeStyles({
    root: {
        width: '100%',
    },
});

export const FetchView = <P extends any = object, A = any, B = any, C = any, D = any, E = any> ({
    animation,
    className,
    style,
    Loader = LoaderPlaceholder,
    Error = ErrorPlaceholder,
    onLoadEnd,
    onLoadStart,
    children,
    state,
    payload,
    ...otherProps
}: IFetchViewProps<P, A, B, C, D, E>) => {

    const classes = useStyles();

    const [appear, setAppear] = useState(false);

    const handleData = async (payload: P): Promise<[A, B, C, D, E]>  => {
        if (typeof state === 'function') {
            const result = state(payload);
            if (Array.isArray(result)) {
                return await Promise.all(result) as unknown as [A, B, C, D, E];
            } else {
                return [await result] as unknown as [A, B, C, D, E];
            }
        } else {
            return [] as unknown as [A, B, C, D, E];
        }
    };

    const handleLoadStart = () => {
        onLoadStart && onLoadStart();
        setAppear(false);
    };

    const handleLoadEnd = (isOk: boolean) => {
        onLoadEnd && onLoadEnd(isOk);
        setAppear(true);
    };

    return (
        <Reveal
            className={classNames(className, classes.root)}
            style={style}
            animation={animation}
            appear={appear}
        >
            <Async<P>
                {...otherProps}
                Loader={Loader}
                Error={Error}
                onLoadStart={handleLoadStart}
                onLoadEnd={handleLoadEnd}
                payload={payload}
            >
                {async (payload) => {
                    const data = await handleData(payload);
                    return children(...data);
                }}
            </Async>
        </Reveal>
    );
};

export default FetchView;
