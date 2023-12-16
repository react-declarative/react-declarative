import * as React from 'react';
import { Suspense, lazy } from 'react';

import LoaderView from '../components/LoaderView';

interface IParams {
    loaderSize: number;
}

const DEFAULT_LOADER_SIZE = 48;

export const heavy = <T extends React.ComponentType<any>>(factory: () => Promise<{ default: T }>, {
    loaderSize = DEFAULT_LOADER_SIZE,
}: Partial<IParams> = {}) => {
    const Component = lazy<any>(factory);
    return () => (
        <Suspense fallback={<LoaderView size={loaderSize} />}>
            <Component />
        </Suspense>
    );
};

export default heavy;
