import * as React from 'react';
import { useEffect, useContext, useState, useCallback } from 'react';
import { createContext, createElement } from 'react';

import NoSsr from '../NoSsr';

import useForceUpdate from './hooks/useForceUpdate';

import IAnything from '../../model/IAnything';

import { ThemeProvider } from '../../styles';

/**
 * Interface for the properties of the ModalProvider component.
 */
interface IModalProviderProps {
    children: React.ReactNode;
}

/**
 * Represents an interface for a renderer component.
 *
 * @typedef {React.ComponentType<IAnything>} IRenderer
 *
 * @interface
 */
type IRenderer = React.ComponentType<IAnything>;

/**
 * Represents a context for handling rendering, update, and clear operations.
 * @interface
 */
interface IContext {
    handleElement: (element: IRenderer) => void;
    handleUpdate: () => void;
    handleClear: () => void;
}

/**
 * Represents a hook that provides methods for rendering and manipulating modals.
 *
 * @typedef {function} IHook
 * @param render - The renderer to use for rendering the modals.
 * @param [deps] - Optional dependencies required for the hook.
 * @returns An object containing the methods for showing and hiding modals.
 *
 * @method showModal - Show a modal.
 * @method hideModal - Hide a modal.
 */
interface IHook {
    (render: IRenderer, deps?: any[]): {
        showModal: Function;
        hideModal: Function;
    };
}

const ModalContext = createContext<IContext>(null as never);

/**
 * ModalProvider
 *
 * The ModalProvider component provides a context for managing modals and rendering elements.
 *
 * @param props - The props for the ModalProvider component.
 * @param props.children - The child nodes to be rendered within the ModalProvider.
 *
 * @returns - The ModalProvider component.
 */
export const ModalProvider = ({
    children
}: IModalProviderProps) => {

    const [element, setElement] = useState<IRenderer | null>(null);

    /**
     * Handles the element using the useCallback hook in React.
     *
     * @param element - The element to handle.
     * @returns - No return value.
     */
    const handleElement = useCallback((element: IRenderer) => setElement(() => element), []);
    /**
     * Clears the element value using the useCallback hook.
     *
     * @function handleClear
     * @returns
     */
    const handleClear = useCallback(() => setElement(null), []);
    /**
     * The handleUpdate variable is a function that triggers a re-render of a React component.
     * It can be used to force an update of the component when needed.
     *
     * @type {Function}
     */
    const handleUpdate = useForceUpdate();

    /**
     * This variable represents a collection of functions.
     * It has three properties:
     *
     * - handleElement: A function that handles elements.
     * - handleClear: A function that handles clearing.
     * - handleUpdate: A function that handles updates.
     *
     * @type {Object}
     */
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

/**
 * useModal is a custom hook that provides functionality to show and hide a modal.
 *
 * @typedef {Object} IHook
 * @property showModal - A function that shows the modal.
 * @property hideModal - A function that hides the modal.
 *
 * @param renderer - The renderer function to be executed when the modal is shown.
 * @param deps - The dependencies array to trigger updates when the modal is shown.
 * @returns The object containing the showModal and hideModal functions.
 */
export const useModal: IHook = (renderer: IRenderer, deps = []) => {

    const [open, setOpen] = useState(false);

    const { handleElement, handleClear, handleUpdate } = useContext(ModalContext);

    /**
     * Executes the handleRender function.
     *
     * @function handleRender
     * @returns
     */
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

    /**
     * Function to show modal.
     *
     * @callback showModal
     * @return {void}
     */
    const showModal = useCallback(() => {
        setOpen(true);
    }, []);

    /**
     * Function to hide a modal.
     *
     * @function hideModal
     * @returns
     */
    const hideModal = useCallback(() => {
        setOpen(false);
    }, []);

    return {
        showModal,
        hideModal,
    } as const;

};

export default ModalProvider;
