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

/**
 * A higher-order component that provides a payload context to its descendants.
 *
 * @param props - The component props.
 * @param props.children - The children components.
 * @param props.value - The payload value to provide to the context.
 * @returns - The modified component with the payload context provider.
 */
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
