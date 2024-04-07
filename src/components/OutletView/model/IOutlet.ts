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
 */
export interface IOutlet<Data = IAnything, Payload = IAnything, Params = IAnything, OtherProps = IOtherProps> {
    id: string;
    /**
     * Renders an element for the active outlet
     *
     * @param props - The props to pass to the element.
     * @returns - The rendered element.
     */
    element: (props: IOutletProps<Data, Payload, Params> & OtherProps) => React.ReactElement;
    /**
     * Checks if a given path is available.
     *
     * @param pathname - The path to be checked.
     * @returns - True if the path is available, false otherwise.
     */
    isAvailable?: (pathname: string) => boolean;
    /**
     * Determines if the given pathname is active.
     *
     * @param pathname - The URL pathname to check.
     * @returns - True if the pathname is active, false otherwise.
     */
    isActive: (pathname: string) => boolean;
}

export default IOutlet;
