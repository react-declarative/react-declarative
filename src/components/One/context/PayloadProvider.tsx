import * as React from 'react';
import { useContext } from 'react';
import { createContext } from 'react';

import IOneProps from '../../../model/IOneProps';

const PayloadContext = createContext<Exclude<IOneProps['payload'], undefined>>(null as never);

interface IPayloadProviderProps {
    children: React.ReactNode;
    payload?: IOneProps['payload'];
}

export const PayloadProvider = ({
    children,
    payload = {},
}: IPayloadProviderProps) => (
    <PayloadContext.Provider value={payload}>
        {children}
    </PayloadContext.Provider>
);

export const usePayload = () => useContext(PayloadContext);

export default PayloadProvider;
