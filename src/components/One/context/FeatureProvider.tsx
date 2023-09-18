import * as React from 'react';
import { useContext } from 'react';
import { createContext } from 'react';

import IOneProps from '../../../model/IOneProps';

const FeatureContext = createContext<Exclude<IOneProps['features'], undefined>>(null as never);

interface IFeatureProviderProps {
    children: React.ReactNode;
    features?: IOneProps['features'];
}

export const FeatureProvider = ({
    children,
    features = [],
}: IFeatureProviderProps) => (
    <FeatureContext.Provider value={features}>
        {children}
    </FeatureContext.Provider>
);

export const useOneFeatures = () => useContext(FeatureContext);

export default FeatureProvider;
