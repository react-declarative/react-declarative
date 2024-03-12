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

interface IModalManagerProviderProps {
    onLoadStart?: () => void;
    onLoadEnd?: (isOk: boolean) => void;
    throwError?: boolean;
    fallback?: (error: Error) => void;
    children: React.ReactNode;
}

interface IModalEntity extends IModal {
    key: string;
}

interface IState {
    modalStack: IModalEntity[];
    count: number;
}

const DEFAULT_MODAL: IModalEntity = {
    key: randomString(),
    id: "unknown",
    render: () => null,
};

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

    const value = useMemo(() => ({
        modalStack: modalStack$.current,
        pop: () => setModalStack(modalStack$.current.slice(1)),
        push: async (modal: IModal) => {
            await execute(modal.onInit);
            setModalStack([{ ...modal, key: randomString() }, ...modalStack$.current])
        },
        clear: () => setState(INITIAL_STATE),
    }), [modalStack]);

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
