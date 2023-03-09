import * as React from 'react';
import { createContext, useContext } from 'react';

import useSingleton from '../../../hooks/useSingleton';

import IAnything from '../../../model/IAnything';
import IListProps from '../../../model/IListProps';

const PayloadContext = createContext<IAnything>(null as never);

interface IPayloadProviderProps {
    children: React.ReactNode;
    value?: Exclude<IListProps['payload'], undefined>;
}

export const PayloadProvider = ({
    children,
    value,
}: IPayloadProviderProps) => {
    const payload = useSingleton(value);
    return (
        <PayloadContext.Provider value={payload}>
            {children}
        </PayloadContext.Provider>
    );
};

export const usePayload = () => useContext(PayloadContext);

export default usePayload;
