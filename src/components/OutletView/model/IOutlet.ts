import * as React from 'react';

import IAnything from '../../../model/IAnything';
import IOutletProps from './IOutletProps';
import IOtherProps from './IOtherProps';

export interface IOutlet<Data = IAnything, Payload = IAnything, Params = IAnything, OtherProps = IOtherProps> {
    id: string;
    element: (props: IOutletProps<Data, Payload, Params> & OtherProps) => React.ReactElement;
    isAvailable?: (pathname: string) => boolean;
    isActive: (pathname: string) => boolean;
}

export default IOutlet;
