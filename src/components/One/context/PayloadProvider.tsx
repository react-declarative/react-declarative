import * as React from 'react';
import { useContext } from 'react';
import { createContext } from 'react';

import IOneProps from '../../../model/IOneProps';

const PayloadContext = createContext<Exclude<IOneProps['payload'], undefined>>(null as never);

/**
 * An interface representing the props for the PayloadProvider component.
 */
interface IPayloadProviderProps {
    children: React.ReactNode;
    payload?: IOneProps['payload'];
}

const OBJECT_VALUE = {};

/**
 * PayloadProvider component
 * @param children - The child components to render within the provider
 * @param payload - The payload value to be provided by the provider
 * @returns - The rendered component with payload context provider
 */
export const PayloadProvider = ({
    children,
    payload = OBJECT_VALUE,
}: IPayloadProviderProps) => (
    <PayloadContext.Provider value={payload}>
        {children}
    </PayloadContext.Provider>
);

export const useOnePayload = () => useContext(PayloadContext);

export default PayloadProvider;
