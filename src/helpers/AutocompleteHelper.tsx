import * as React from 'react';

import { createContext } from 'react';
import { useContext } from 'react';

type Subscription = (name: string, value: any) => void;

interface IAutocompleteHelperProps {
    children: React.ReactChild;
    handleWrite: Subscription;
}

const AutocompleteContext = createContext<Subscription>(null as never);

export const AutocompleteHelper = ({
    children,
    handleWrite,
}: IAutocompleteHelperProps) => (
    <AutocompleteContext.Provider value={handleWrite}>
        {children}
    </AutocompleteContext.Provider>
);

export const useAutocompleteHelper = () => useContext(AutocompleteContext);

export default AutocompleteHelper;
