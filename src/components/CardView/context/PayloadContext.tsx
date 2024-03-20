import * as React from 'react';
import { createContext, useContext } from 'react';

import useSingleton from '../../../hooks/useSingleton';

import ICardViewProps from '../model/ICardViewProps';

type Payload = any;

const PayloadContext = createContext<Payload>(null as never);

/**
 * Represents the properties for the `IPayloadContextProvider` component.
 */
interface IPayloadContextProviderProps {
    children: React.ReactNode;
    value: Exclude<ICardViewProps['payload'], undefined>;
}

export const PayloadContextProvider = ({
    children,
    value,
}: IPayloadContextProviderProps) => {
    const payload = useSingleton(value);
    return (
        <PayloadContext.Provider value={payload}>
            {children}
        </PayloadContext.Provider>
    );
};

export const usePayloadContext = () => useContext(PayloadContext);

export default usePayloadContext;
