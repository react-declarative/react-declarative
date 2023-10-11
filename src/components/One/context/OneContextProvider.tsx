import * as React from 'react';
import { createContext, useContext } from 'react';

import IOneProps from '../../../model/IOneProps';

export const DEFAULT_VALUE = {};

const OneContext = createContext<IOneProps['context']>(DEFAULT_VALUE);

interface IOneContextProviderProps {
    context: IOneProps['context'];
    children: React.ReactNode;
}

export const OneContextProvider = ({
    context = DEFAULT_VALUE,
    children,
}: IOneContextProviderProps) => (
    <OneContext.Provider value={context}>
        {children}
    </OneContext.Provider>
);

export const useOneContext = () => useContext(OneContext) || DEFAULT_VALUE;

export default OneContextProvider;
