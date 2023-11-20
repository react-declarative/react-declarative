import * as React from 'react';
import { useMemo, useState } from 'react';

import ModalManagerContext from './context/ModalManagerContext';

import Bootstrap from './components/Bootstrap';

import randomString from '../../utils/randomString';

import IModal from './model/IModal';

interface IModalManagerProviderProps {
    children: React.ReactNode;
}

interface IModalEntity extends IModal {
    key: string;
}

const DEFAULT_MODAL: IModalEntity = {
    key: randomString(),
    id: "unknown",
    render: () => null,
};

export const ModalManagerProvider = ({
    children,
}: IModalManagerProviderProps) => {

    const [modalStack, setModalStack] = useState<IModalEntity[]>([]);

    const value = useMemo(() => ({
        modalStack: [],
        pop: () => setModalStack((modalStack) => modalStack.slice(1)),
        push: (modal: IModal) => setModalStack((modalStack) => [{ ...modal, key: randomString() }, ...modalStack]),
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
            />
        </ModalManagerContext.Provider>
    );
}

export default ModalManagerProvider;
