import * as React from 'react';

import { createContext, createElement } from 'react';
import { useEffect, useContext, useState, useCallback } from 'react';

import randomString from '../../../utils/randomString';

import IAnything from '../../../model/IAnything';

import { ThemeProvider } from '../../../styles';

interface IModalProviderProps {
    children: React.ReactNode;
}

type IRenderer = React.ComponentType<IAnything>;

interface IContext {
    handleElement: (element: React.ReactNode) => void;
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

    const [element, setElement] = useState<React.ReactNode>(null);

    const handleElement = (element: React.ReactNode) => setElement(element);

    const handleClear = () => setElement(null);

    const value = {
        handleElement,
        handleClear,
    };

    return (
        <ThemeProvider>
            <ModalContext.Provider value={value}>
                {children}
                {element}
            </ModalContext.Provider>
        </ThemeProvider>
    );
};

export const useModal: IHook = (renderer: IRenderer, deps = []) => {

    const [open, setOpen] = useState(false);

    const { handleElement, handleClear } = useContext(ModalContext);

    const handleRender = useCallback(() => {
        handleElement(createElement(renderer, {
            key: randomString(),
        }));
    }, deps);

    useEffect(() => {
        if (open) {
            handleRender();
        } else {
            handleClear();
        }
    }, [handleRender, open])

    const showModal = () => {
        setOpen(true);
    };

    const hideModal = () => {
        setOpen(false);
    };

    return {
        showModal,
        hideModal,
    };

};

export default ModalProvider;
