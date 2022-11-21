import * as React from 'react';
import { useContext } from 'react';
import { createContext } from 'react';

import IOneApi from '../../../model/IOneApi';

const ApiContext = createContext<React.Ref<IOneApi> | null>(null);

interface IApiProviderProps {
    children: React.ReactNode;
    apiRef?: React.Ref<IOneApi>;
}

export const ApiProvider = ({
    children,
    apiRef = null,
}: IApiProviderProps) => (
    <ApiContext.Provider value={apiRef}>
        {children}
    </ApiContext.Provider>
);

export const useApiRef = () => useContext(ApiContext);

export default ApiProvider;
