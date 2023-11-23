import * as React from 'react';
import { useContext } from 'react';
import { createContext } from 'react';

import IOneProps from '../../../model/IOneProps';

const PayloadContext = createContext<Exclude<IOneProps['payload'], undefined>>(null as never);

interface IPayloadProviderProps {
    children: React.ReactNode;
    payload?: IOneProps['payload'];
}

const OBJECT_VALUE = {};

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
