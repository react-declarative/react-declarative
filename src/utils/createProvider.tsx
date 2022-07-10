import * as React from 'react';

import { createContext, useContext, useMemo } from "react";

export const createProvider = <T extends any, P extends any = T>(createPayload = (p: P) => p as T) => {

    const Context = createContext<T>(null as never);
    
    const Provider = ({
        children,
        payload,
    }: React.PropsWithChildren<{
        payload: P extends T ? P : undefined;
    }>) => {
        const value = useMemo(() => createPayload(payload as P), [payload]);
        return (
            <Context.Provider value={value}>
                {children}
            </Context.Provider>
        );
    };

    const usePayload = () => useContext(Context);

    return [Provider, usePayload] as const;
};

export default createProvider;
