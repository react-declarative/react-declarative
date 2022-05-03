import * as React from 'react';
import { createContext, useContext } from 'react';

import useResolved from '../hooks/useResolved';

import IAnything from '../../../model/IAnything';
import IOneProps from '../../../model/IOneProps';

interface IStateProviderProps<Data = IAnything> extends 
    IOneProps<Data> {
    children: React.ReactElement;
}

interface IState<Data = IAnything> {
    object: Data | null;
    setObject: (data: Data) => void;
}

const StateContext = createContext<IState>(null as never);

export const StateProvider = <Data extends IAnything>({
    children,
    ...otherProps
}: IStateProviderProps<Data>) => {

    const {
        fields = [],
        roles,
        change = () => null,
        fallback = () => null,
        handler = () => ({} as Data),
    } = otherProps;

    const [object, setObjectHook] = useResolved<Data>({
        handler,
        fallback,
        fields,
        roles,
        change,
    });

    const setObject = (data: Data) => {
        setObjectHook(data);
        change!(data, false);
    };

    const managed: IState<Data> = {
        object,
        setObject,
    };

    return (
        <StateContext.Provider value={managed}>
            {!!object && children}
        </StateContext.Provider>
    );
};

export const useOneState = <Data extends IAnything>() => useContext(StateContext) as IState<Data>;

export default StateProvider;
