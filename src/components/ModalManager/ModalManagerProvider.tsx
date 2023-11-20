import * as React from 'react';
import { useMemo, useState } from 'react';

import ModalManagerContext from './context/ModalManagerContext';
import ModalRender from './model/ModalRender';

interface IModalManagerProviderProps {
    children: React.ReactNode;
}

export const ModalManagerProvider = ({
    children,
}: IModalManagerProviderProps) => {

    const [outletStack, setOutletStack] = useState<ModalRender[]>([]);

    const value = useMemo(() => ({
        outletStack: [],
        pop: () => setOutletStack((outletStack) => outletStack.slice(1)),
        push: (render: ModalRender) => setOutletStack((outletStack) => [render, ...outletStack]),
    }), [outletStack]);

    const render = useMemo(() => {
        const [render = () => null] = outletStack; 
        return render;
    }, [outletStack]);

    return (
        <ModalManagerContext.Provider value={value}>
            {children}
            {render()}
        </ModalManagerContext.Provider>
    );
}

export default ModalManagerProvider;
