import * as React from 'react';
import { useMemo, useState, useCallback } from 'react';

import { makeStyles, useTheme } from '../../styles';
import { alpha, createTheme, ThemeProvider } from '@mui/material/styles';

import Backdrop from '@mui/material/Backdrop';

import ModalManagerContext from './context/ModalManagerContext';

import Bootstrap from './components/Bootstrap';

import randomString from '../../utils/randomString';

import useActualValue from '../../hooks/useActualValue';

import IModal from './model/IModal';

interface IModalManagerProviderProps {
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

export const ModalManagerProvider = ({
    children,
}: IModalManagerProviderProps) => {

    const { classes } = useStyles();
    const theme = useTheme();

    const [{ modalStack, count }, setState] = useState<IState>(INITIAL_STATE);

    const modalStack$ = useActualValue(modalStack);

    const setModalStack = useCallback((modalStack: IModalEntity[]) => setState(({ count }) => ({
        modalStack,
        count: modalStack.length === 0 ? 0 : count + 1,
    })), []);

    const value = useMemo(() => ({
        modalStack: modalStack$.current,
        pop: () => setModalStack(modalStack$.current.slice(1)),
        push: (modal: IModal) => {
            modal.onInit && modal.onInit();
            setModalStack([{ ...modal, key: randomString() }, ...modalStack$.current])
        },
        clear: () => setState(INITIAL_STATE),
    }), [modalStack]);

    const modal = useMemo(() => {
        const [modal = DEFAULT_MODAL] = modalStack; 
        return modal;
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
