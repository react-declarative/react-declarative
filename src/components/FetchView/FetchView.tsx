import * as React from 'react';
import { useState } from 'react';

import { makeStyles } from '../../styles';

import Async, { IAsyncProps } from '../Async';

import { Loaderlaceholder } from './components/Placeholder';
import { ErrorPlaceholder } from './components/Placeholder';

import Reveal, { IRevealProps } from './components/Reveal';

import classNames from '../../utils/classNames';

type Data = Record<string, any>;

type FetchState<T extends any = object, D = Data> = (payload: T) => D | Promise<D>;

export interface IFetchViewProps<P extends any = object, D = Data> extends Omit<IAsyncProps<P>, keyof {
    children: never;
}> {
    animation?: IRevealProps['animation'];
    className?: string;
    style?: React.CSSProperties;
    state: FetchState<P, D> | (FetchState<P, D>[]);
    children: (data: D | D[]) => React.ReactNode;
};

const useStyles = makeStyles({
    root: {
        width: '100%',
    },
});

export const FetchView = <P extends any = object, D = Data> ({
    animation,
    className,
    style,
    Loader = Loaderlaceholder,
    Error = ErrorPlaceholder,
    onLoadEnd,
    onLoadStart,
    children,
    state,
    ...otherProps
}: IFetchViewProps<P, D>) => {

    const classes = useStyles();

    const [appear, setAppear] = useState(false);

    const handleData = async (payload: P)  => {
        if (Array.isArray(state)) {
            return await Promise.all(state.map((item) => item(payload)));
        } else {
            return await state(payload);
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
            >
                {async (payload) => {
                    const data = await handleData(payload);
                    return children(data);
                }}
            </Async>
        </Reveal>
    );
};

export default FetchView;
