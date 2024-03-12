import * as React from 'react';
import { useEffect } from 'react';

import Container from './components/Container';

import { createStateManager, StateContextProvider } from './context/StateContext';
import { HoverContextProvider } from './context/HoverContext';
import { PropsContextProvider } from './context/PropsContext';

import IScaffold2Props from './model/IScaffold2Props';
import Payload from './model/Payload';

/**
 * Represents a scaffold component that provides state management and context providers.
 * @function Scaffold2
 * @param {object} props - The props object containing the component's properties.
 * @param {string} [props.appName="Scaffold2"] - The name of the app.
 * @param {boolean} [props.noSearch=false] - Specifies if the search feature is disabled.
 * @param {boolean} [props.noAppName=false] - Specifies if the app name should be hidden.
 * @param {Function} props.onInit - The callback function invoked during initialization.
 * @param {Function} props.onLoadStart - The callback function invoked before loading data.
 * @param {Function} props.onLoadEnd - The callback function invoked after loading data.
 * @param {React.ReactNode} props.fallback - The fallback component to render in case of an error.
 * @param {object} props.options - The options object.
 * @param {object} props.payload - The payload object.
 * @param {Array} [props.deps=[]] - The array of dependencies.
 * @param {boolean} props.throwError - Specifies if an error should be thrown.
 * @returns {React.ReactNode} - The rendered component.
 */
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
