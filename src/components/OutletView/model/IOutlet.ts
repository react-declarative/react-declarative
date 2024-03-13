import * as React from 'react';

import IAnything from '../../../model/IAnything';
import IOutletProps from './IOutletProps';
import IOtherProps from './IOtherProps';

/**
 * Represents an outlet that can be used to render content in a specific location in a React application.
 *
 * @template Data - The type of data to be passed to the outlet's props.
 * @template Payload - The type of payload to be passed to the outlet's props.
 * @template Params - The type of URL parameters to be passed to the outlet's props.
 * @template OtherProps - Additional properties to be passed to the outlet's props.
 *
 * @property id - The unique identifier of the outlet.
 * @property element - The React component function that renders the outlet's content.
 * @property [isAvailable] - Optional. A function that determines whether the outlet is available for a given pathname.
 * @property isActive - A function that determines whether the outlet is active for a given pathname.
 *
 * @example
 *
 * const sampleOutlet: IOutlet = {
 *   id: 'sample-outlet',
 *   element: (props) => <div>{props.title}</div>,
 *   isAvailable: (pathname) => pathname === '/sample',
 *   isActive: (pathname) => pathname.startsWith('/sample'),
 * };
 *
 * @example
 *
 * const sampleOutlet: IOutlet<number, string, {id: number}> = {
 *   id: 'sample-outlet',
 *   element: (props) => <div>{props.data}</div>,
 *   isAvailable: (pathname) => true,
 *   isActive: (pathname) => false,
 * };
 */
export interface IOutlet<Data = IAnything, Payload = IAnything, Params = IAnything, OtherProps = IOtherProps> {
    id: string;
    element: (props: IOutletProps<Data, Payload, Params> & OtherProps) => React.ReactElement;
    isAvailable?: (pathname: string) => boolean;
    isActive: (pathname: string) => boolean;
}

export default IOutlet;
