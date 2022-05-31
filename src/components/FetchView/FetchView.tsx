import React from 'react';
import { useState } from 'react';

import { makeStyles } from '../../styles';

import Async, { IAsyncProps } from '../Async';

import { Loaderlaceholder } from './components/Placeholder';
import { ErrorPlaceholder } from './components/Placeholder';

import Reveal, { IRevealProps } from './components/Reveal';

import classNames from '../../utils/classNames';

type Data = Record<string, any> | Record<string, any>[];

type FetchState<T extends any = object> = (payload: T) => Data | Promise<Data>;

interface IFetchViewProps<T extends any = object> extends Omit<IAsyncProps<T>, keyof {
    children: never;
}> {
    animation?: IRevealProps['animation'];
    className?: string;
    style?: React.CSSProperties;
    state: FetchState<T> | FetchState<T>[];
    children: (data: Data) => React.ReactNode;
};

const useStyles = makeStyles({
    root: {
        width: '100%',
    },
});

export const FetchView = <T extends any = object> ({
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
}: IFetchViewProps<T>) => {

    const classes = useStyles();

    const [appear, setAppear] = useState(false);

    const handleData = async (payload: T) => {
        if (Array.isArray(state)) {
            return await Promise.all(state.map((item) => item(payload)));
        } else {
            return await Promise.resolve(state(payload));
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
            <Async
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
