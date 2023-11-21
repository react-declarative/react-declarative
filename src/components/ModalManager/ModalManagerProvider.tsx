import * as React from 'react';
import { useMemo, useState, useCallback } from 'react';

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

export const ModalManagerProvider = ({
    children,
}: IModalManagerProviderProps) => {

    const [{ modalStack, count }, setState] = useState<IState>(INITIAL_STATE);

    const modalStack$ = useActualValue(modalStack);

    const setModalStack = useCallback((modalStack: IModalEntity[]) => setState(({ count }) => ({
        modalStack,
        count: modalStack.length === 0 ? 0 : count + 1,
    })), []);

    const value = useMemo(() => ({
        modalStack: [],
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

    const stack = useMemo(() => {
        return modalStack.slice(1, modalStack.length);
    }, [modalStack]);

    return (
        <ModalManagerContext.Provider value={value}>
            {children}
            <Bootstrap
                {...modal}
                modalStack={stack}
                count={count}
            />
        </ModalManagerContext.Provider>
    );
}

export default ModalManagerProvider;
