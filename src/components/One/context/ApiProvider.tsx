import * as React from 'react';
import { useContext, useMemo } from 'react';
import { createContext } from 'react';

import IOneApi from '../../../model/IOneApi';
import IOneProps from '../../../model/IOneProps';

interface Context {
    apiRef: React.Ref<IOneApi> | null;
    reloadSubject: Exclude<IOneProps['reloadSubject'], undefined> | null;
    changeSubject: Exclude<IOneProps['changeSubject'], undefined> | null;
    updateSubject: Exclude<IOneProps['updateSubject'], undefined> | null;
}

const ApiContext = createContext<Context>(null as never);

interface IApiProviderProps {
    children: React.ReactNode;
    apiRef?: React.Ref<IOneApi> | null;
    reloadSubject?: IOneProps['reloadSubject'] | null;
    changeSubject?: IOneProps['changeSubject'] | null;
    updateSubject?: IOneProps['updateSubject'] | null;
}

export const ApiProvider = ({
    children,
    apiRef = null,
    reloadSubject = null,
    changeSubject = null,
    updateSubject = null,
}: IApiProviderProps) => {
    const value = useMemo(() => ({
        apiRef,
        reloadSubject,
        changeSubject,
        updateSubject,
    }), [
        apiRef,
        reloadSubject,
        changeSubject,
        updateSubject,
    ]);
    return (
        <ApiContext.Provider value={value}>
            {children}
        </ApiContext.Provider>
    );
};

export const useApiRef = () => useContext(ApiContext);

export default ApiProvider;
