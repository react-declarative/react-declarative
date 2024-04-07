import * as React from 'react';
import { useMemo, useState, useCallback } from 'react';

import { makeStyles, useTheme } from '../../styles';
import { alpha, createTheme, ThemeProvider } from '@mui/material/styles';

import Backdrop from '@mui/material/Backdrop';

import ModalManagerContext from './context/ModalManagerContext';

import Bootstrap from './components/Bootstrap';

import randomString from '../../utils/randomString';

import useActualValue from '../../hooks/useActualValue';
import useQueuedAction from '../../hooks/useQueuedAction';

import IModal from './model/IModal';

/**
 * Represents the properties for the `ModalManagerProvider` component.
 */
interface IModalManagerProviderProps {
    onLoadStart?: () => void;
    onLoadEnd?: (isOk: boolean) => void;
    throwError?: boolean;
    fallback?: (error: Error) => void;
    children: React.ReactNode;
}

/**
 * Represents an entity that can be used as a modal in an application.
 * @interface
 * @extends IModal
 */
interface IModalEntity extends IModal {
    key: string;
}

/**
 * Represents the state of the application.
 * @interface
 */
interface IState {
    modalStack: IModalEntity[];
    count: number;
}

/**
 * @typedef {object} IModalEntity
 * @property key - The key of the modal entity.
 * @property id - The id of the modal entity.
 * @property render - The render function for the modal entity.
 */
const DEFAULT_MODAL: IModalEntity = {
    key: randomString(),
    id: "unknown",
    render: () => null,
};

/**
 * @typedef {Object} IState
 * @property modalStack - The stack of modals.
 * @property count - The count.
 */
const INITIAL_STATE: IState = {
    modalStack: [],
    count: 0,
};

const useStyles = makeStyles()({
    backdrop: {
        color: alpha('#000', 0.5),
        zIndex: 1300,
    },
});

/**
 * ModalManagerProvider component provides a context for managing modals in an application.
 *
 * @param props - The props object containing the following properties:
 *   - children: ReactNode - The child components to be rendered inside the provider.
 *   - fallback: ReactNode - The fallback component to be rendered when there are no modals.
 *   - throwError: boolean - Whether to throw an error when an unexpected state occurs.
 *   - onLoadEnd: function - Callback function to be executed after loading ends.
 *   - onLoadStart: function - Callback function to be executed before loading starts.
 *
 * @returns The rendered ModalManagerProvider component.
 */
export const ModalManagerProvider = ({
    children,
    fallback,
    throwError,
    onLoadEnd,
    onLoadStart,
}: IModalManagerProviderProps) => {

    const { classes } = useStyles();
    const theme = useTheme();

    const [{ modalStack, count }, setState] = useState<IState>(INITIAL_STATE);

    const modalStack$ = useActualValue(modalStack);

    /**
     * Sets the modal stack and updates the state.
     *
     * @param modalStack - The new modal stack.
     * @returns
     */
    const setModalStack = useCallback((modalStack: IModalEntity[]) => setState(({ count }) => ({
        modalStack,
        count: modalStack.length === 0 ? 0 : count + 1,
    })), []);

    const { execute } = useQueuedAction(async (fn: IModal['onInit']) => {
        fn && await fn();
    }, {
        onLoadStart,
        onLoadEnd,
        fallback,
        throwError,
    })

    /**
     * A memoized object that encapsulates modal stack operations.
     *
     * @typedef {Object} ModalStack
     * @property modalStack - The current modal stack.
     * @property pop - Removes the first modal from the stack.
     * @property push - Adds a new modal to the stack.
     * @property clear - Clears the modal stack.
     */
    const value = useMemo(() => ({
        modalStack: modalStack$.current,
        pop: () => setModalStack(modalStack$.current.slice(1)),
        push: async (modal: IModal) => {
            await execute(modal.onInit);
            setModalStack([{ ...modal, key: randomString() }, ...modalStack$.current])
        },
        clear: () => setState(INITIAL_STATE),
    }), [modalStack]);

    /**
     * Creates a memoized modal entity based on the given modal stack.
     *
     * @returns The memoized modal entity.
     *
     * @description
     * The `modal` variable is a memoized modal entity created using the `useMemo` hook.
     * It takes the `modalStack` as a dependency and returns the memoized entity.
     * The returned entity includes the properties `onInit`, `onMount`, `onUnmount`, and other properties.
     * The value of these properties are modified versions of the corresponding properties from the `modal` object.
     * The `onInit`, `onMount`, and `onUnmount` properties are wrapped in a function that calls the original function with any given arguments.
     * The other properties are spread from the `modal` object.
     */
    const modal = useMemo((): IModalEntity => {
        const [modal = DEFAULT_MODAL] = modalStack; 
        const {
            onInit = () => {},
            onMount = () => {},
            onUnmount = () => {},
            ...other
        } = modal;
        return {
            onInit: () => void execute(onInit),
            onMount: (...args) => void execute(() => onMount(...args)),
            onUnmount: (...args) => void execute(() => onUnmount(...args)),
            ...other
        };
    }, [modalStack]);

    /**
     * Variable backdrop
     *
     * @type {Object}
     * @description Returns a memoized version of the theme object with the MuiBackdrop component's root style overridden to have a transparent background.
     * @param theme - The original theme object.
     * @returns The customized theme object with the MuiBackdrop component's root style overridden.
     */
    const backdrop = useMemo(() => createTheme({
        ...theme,
        components: {
            ...theme.components,
            MuiBackdrop: {
                styleOverrides: {
                    root: {
                        background: 'transparent',
                    },
                },
            },
        },
    }), [theme]);

    /**
     * Represents a stack of modals
     */
    const stack = useMemo(() => {
        return modalStack.slice(1, modalStack.length);
    }, [modalStack]);

    return (
        <ModalManagerContext.Provider value={value}>
            {children}
            <ThemeProvider theme={backdrop}>
                <Bootstrap
                    {...modal}
                    modalStack={stack}
                    count={count}
                />
            </ThemeProvider>
            {!!modalStack.length && (
                <Backdrop
                    open
                    className={classes.backdrop}
                />
            )}
        </ModalManagerContext.Provider>
    );
}

export default ModalManagerProvider;
