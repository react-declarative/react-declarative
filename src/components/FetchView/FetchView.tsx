import * as React from 'react';
import { useState } from 'react';

import { makeStyles } from '../../styles';

import Async, { IAsyncProps } from '../Async';

import { LoaderPlaceholder } from './components/Placeholder';
import { ErrorPlaceholder } from './components/Placeholder';
import Reveal, { IRevealProps } from './components/Reveal';

import classNames from '../../utils/classNames';

type Result = React.ReactNode | void;

type ObjectState<P extends any = object, A = any> = ((payload: P) => Promise<A>)
    | ((payload: P) => A);

type TupleState<P extends any = object, A = any, B = any, C = any, D = any, E = any, F = any, G = any, H = any, I = any, J = any>  = 
    ((payload: P) => readonly [Promise<A>?, Promise<B>?, Promise<C>?, Promise<D>?, Promise<E>?, Promise<F>?, Promise<G>?, Promise<H>?, Promise<I>?, Promise<J>?])
        | ((payload: P) => readonly [A?, B?, C?, D?, E?, F?, G?, H?, I?, J?])
        | ((payload: P) => [Promise<A>?, Promise<B>?, Promise<C>?, Promise<D>?, Promise<E>?, Promise<F>?, Promise<G>?, Promise<H>?, Promise<I>?, Promise<J>?])
        | ((payload: P) => [A?, B?, C?, D?, E?, F?, G?, H?, I?, J?]);

type UnknownState<P extends any = object, A = any, B = any, C = any, D = any, E = any, F = any, G = any, H = any, I = any, J = any>  = 
    ObjectState<P, A>
        | TupleState<P, A, B, C, D, E, F, G, H, I, J>;

type Fn = (...args: any) => any;

export interface IFetchViewProps<P extends any = object, 
    A = any,
    B = any,
    C = any,
    D = any,
    E = any,
    F = any,
    G = any,
    H = any,
    I = any,
    J = any,
    FN extends Fn = UnknownState<P, A, B, C, D, E, F, G, H, I, J>
> extends Omit<IAsyncProps<P>, keyof {
    children: never;
}> {
    animation?: IRevealProps['animation'];
    className?: string;
    style?: React.CSSProperties;
    state: ReturnType<FN> extends A | Promise<A> ? TupleState<P, A, B, C, D, E, F, J, H, I, J> : ObjectState<P, A>;
    children: (a: A, b: B, c: C, d: D, e: E, f: F, g: G, h: H, i: I, j: J) => Promise<Result> | Result;
};

const useStyles = makeStyles()({
    root: {
        width: '100%',
    },
});

export const FetchView = <P extends any = object, A = any, B = any, C = any, D = any, E = any, F = any, G = any, H = any, I = any, J = any> ({
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
}: IFetchViewProps<P, A, B, C, D, E, F, G, H, I, J>) => {

    const { classes } = useStyles();

    const [appear, setAppear] = useState(false);

    const handleData = async (payload: P): Promise<[A, B, C, D, E, F, G, H, I, J]>  => {
        if (typeof state === 'function') {
            const result = state(payload);
            if (Array.isArray(result)) {
                return await Promise.all(result) as unknown as [A, B, C, D, E, F, G, H, I, J];
            } else {
                return [await result] as unknown as [A, B, C, D, E, F, G, H, I, J];
            }
        } else {
            return [] as unknown as [A, B, C, D, E, F, G, H, I, J];
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
