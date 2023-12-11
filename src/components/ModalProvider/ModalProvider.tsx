import * as React from 'react';
import { useEffect, useContext, useState, useCallback } from 'react';
import { createContext, createElement } from 'react';

import NoSsr from '../NoSsr';

import useForceUpdate from './hooks/useForceUpdate';

import IAnything from '../../model/IAnything';

import { ThemeProvider } from '../../styles';

interface IModalProviderProps {
    children: React.ReactNode;
}

type IRenderer = React.ComponentType<IAnything>;

interface IContext {
    handleElement: (element: IRenderer) => void;
    handleUpdate: () => void;
    handleClear: () => void;
}

interface IHook {
    (render: IRenderer, deps?: any[]): {
        showModal: Function;
        hideModal: Function;
    };
}

const ModalContext = createContext<IContext>(null as never);

export const ModalProvider = ({
    children
}: IModalProviderProps) => {

    const [element, setElement] = useState<IRenderer | null>(null);

    const handleElement = useCallback((element: IRenderer) => setElement(() => element), []);
    const handleClear = useCallback(() => setElement(null), []);
    const handleUpdate = useForceUpdate();

    const value = {
        handleElement,
        handleClear,
        handleUpdate,
    };

    return (
        <NoSsr>
            <ThemeProvider>
                <ModalContext.Provider value={value}>
                    {children}
                    {element && createElement(element)}
                </ModalContext.Provider>
            </ThemeProvider>
        </NoSsr>
    );
};

export const useModal: IHook = (renderer: IRenderer, deps = []) => {

    const [open, setOpen] = useState(false);

    const { handleElement, handleClear, handleUpdate } = useContext(ModalContext);

    const handleRender = useCallback(() => {
        handleElement(renderer);
    }, []);

    useEffect(() => {
        if (open) {
            handleRender();
        } else {
            handleClear();
        }
    }, [open]);

    useEffect(() => {
        if (open) {
            handleUpdate();
        }
    }, [open, ...deps]);

    const showModal = useCallback(() => {
        setOpen(true);
    }, []);

    const hideModal = useCallback(() => {
        setOpen(false);
    }, []);

    return {
        showModal,
        hideModal,
    };

};

export default ModalProvider;
