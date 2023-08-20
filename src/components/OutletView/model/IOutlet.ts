import * as React from 'react';

import IAnything from '../../../model/IAnything';
import IOutletProps from './IOutletProps';

export interface IOutlet<Data = IAnything, Payload = IAnything, Params = IAnything> {
    id: string;
    element: (props: IOutletProps<Data, Payload, Params>) => React.ReactElement;
    isActive: (pathname: string) => boolean;
}

export default IOutlet;
