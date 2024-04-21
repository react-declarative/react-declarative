import * as React from 'react';
import { useEffect } from 'react';

import Container from './components/Container';

import { createStateManager, StateContextProvider } from './context/StateContext';
import { HoverContextProvider } from './context/HoverContext';
import { PropsContextProvider } from './context/PropsContext';

import IScaffold3Props from './model/IScaffold3Props';
import Payload from './model/Payload';

/**
 * Represents a scaffold component that provides state management and context providers.
 * @function Scaffold3
 * @param props - The props object containing the component's properties.
 * @param [props.appName="Scaffold3"] - The name of the app.
 * @param [props.noSearch=false] - Specifies if the search feature is disabled.
 * @param [props.noAppName=false] - Specifies if the app name should be hidden.
 * @param props.onInit - The callback function invoked during initialization.
 * @param props.onLoadStart - The callback function invoked before loading data.
 * @param props.onLoadEnd - The callback function invoked after loading data.
 * @param props.fallback - The fallback component to render in case of an error.
 * @param props.options - The options object.
 * @param props.payload - The payload object.
 * @param [props.deps=[]] - The array of dependencies.
 * @param props.throwError - Specifies if an error should be thrown.
 * @returns - The rendered component.
 */
export const Scaffold3 = <T extends Payload = Payload>(props: IScaffold3Props<T>) => {

    const {
        children,
        appName = "Scaffold3",
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

    /**
     * Creates a state manager for managing the state of an application.
     *
     * @param config - The configuration object for the state manager.
     * @param config.onInit - The callback function to be executed when the state manager is initialized.
     * @param config.onLoadStart - The callback function to be executed when the loading process starts.
     * @param config.onLoadEnd - The callback function to be executed when the loading process ends.
     * @param config.fallback - The fallback function to be executed when an error occurs during loading.
     * @param config.options - The options for the state manager.
     * @param config.payload - The payload to be passed to the state manager.
     * @param config.deps - The dependencies required by the state manager.
     * @param config.throwError - A flag indicating whether to throw an error when an exception occurs.
     *
     * @returns The state manager object.
     */
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

export default Scaffold3;
