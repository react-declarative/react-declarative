import * as React from 'react';
import { useContext } from 'react';
import { createContext } from 'react';

import IOneProps from '../../../model/IOneProps';

const FeatureContext = createContext<Exclude<IOneProps['features'], undefined>>(null as never);

/**
 * Represents the properties of the FeatureProvider component.
 */
interface IFeatureProviderProps {
    children: React.ReactNode;
    features?: IOneProps['features'];
}

const ARRAY_VALUE: string[] = [];

/**
 * Represents a feature provider.
 * @param props - The feature provider props.
 * @param props.children - The child components.
 * @param [props.features=ARRAY_VALUE] - The array of features.
 * @returns - The feature provider component.
 */
export const FeatureProvider = ({
    children,
    features = ARRAY_VALUE,
}: IFeatureProviderProps) => (
    <FeatureContext.Provider value={features}>
        {children}
    </FeatureContext.Provider>
);

export const useOneFeatures = () => useContext(FeatureContext);

export default FeatureProvider;
