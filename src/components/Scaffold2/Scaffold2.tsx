import * as React from 'react';
import { useEffect, useCallback } from 'react';

import Container from './components/Container';
import LoaderDefault from './components/Loader';

import { createStateManager, StateContextProvider } from './context/StateContext';

import IScaffold2Props from './model/IScaffold2Props';
import Payload from './model/Payload';

export const Scaffold2 = <T extends Payload = Payload>({
    children,
    appName = "Scaffold2",
    noSearch = false,
    noAppName = false,
    onInit,
    onLoadStart,
    onLoadEnd,
    fallback,
    options,
    payload,
    throwError,
    Loader = LoaderDefault,
    ...otherProps
}: IScaffold2Props<T>) => {

    const stateContext = createStateManager({
        onInit,
        onLoadStart,
        onLoadEnd,
        fallback,
        options,
        payload,
        throwError,
    });

    useEffect(() => {
        stateContext.doInit();
    }, []);

    const renderInner = useCallback(() => {
        if (stateContext.loading) {
            return (
                <Loader />
            );
        } else {
            return (
                <>
                    {children}
                </>
            );
        }
    }, [stateContext.loading, Loader, children]);

    return (
        <StateContextProvider value={stateContext}>
            <Container<T>
                appName={appName}
                noSearch={noSearch}
                noAppName={noAppName}
                payload={payload}
                options={stateContext.filteredGroups}
                {...otherProps}
            >
                {renderInner()}
            </Container>
        </StateContextProvider>
    );
};

export default Scaffold2;
