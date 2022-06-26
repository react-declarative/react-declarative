import * as React from 'react';
import { useContext } from 'react';
import { createContext } from 'react';

import IAnything from '../../../model/IAnything';
import IOneProps from '../../../model/IOneProps';

const PropsContext = createContext<IOneProps>(null as never);

interface IPropsProviderProps<Data extends IAnything = IAnything> extends IOneProps<Data> {
    children: React.ReactNode;
}

export const PropsProvider = <Data extends IAnything = IAnything>({
    children,
    ...props
}: IPropsProviderProps<Data>) => (
    <PropsContext.Provider value={props}>
        {children}
    </PropsContext.Provider>
);

export const useProps = <Data extends IAnything = IAnything>() => useContext(PropsContext) as IOneProps<Data>;

export default PropsProvider;
