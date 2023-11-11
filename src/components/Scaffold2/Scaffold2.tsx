import * as React from 'react';
import { useEffect } from 'react';

import Container from './components/Container';

import { createStateManager, StateContextProvider } from './context/StateContext';
import { HoverContextProvider } from './context/HoverContext';
import { PropsContextProvider } from './context/PropsContext';

import IScaffold2Props from './model/IScaffold2Props';
import Payload from './model/Payload';

export const Scaffold2 = <T extends Payload = Payload>(props: IScaffold2Props<T>) => {

    const {
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
        deps = [],
        throwError,
        ...otherProps
    } = props;

    const stateContext = createStateManager({
        onInit,
        onLoadStart,
        onLoadEnd,
        fallback,
        options,
        payload,
        deps,
        throwError,
    });

    useEffect(() => {
        stateContext.doInit();
    }, []);

    return (
        <StateContextProvider value={stateContext}>
            <PropsContextProvider value={props}>
                <HoverContextProvider initialState="">
                    <Container<T>
                        appName={appName}
                        noSearch={noSearch}
                        noAppName={noAppName}
                        payload={payload}
                        options={stateContext.filteredGroups}
                        {...otherProps}
                    >
                        {children}
                    </Container>
                </HoverContextProvider>
            </PropsContextProvider>  
        </StateContextProvider>
    );
};

export default Scaffold2;
