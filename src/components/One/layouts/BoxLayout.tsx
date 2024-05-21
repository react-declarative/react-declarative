import * as React from 'react';

import Box from '@mui/material/Box';

import IField from '../../../model/IField';
import IEntity from '../../../model/IEntity';
import IAnything from '../../../model/IAnything';
import { IWrappedLayout, PickProp } from '../../../model/IManaged';

import makeLayout from '../components/makeLayout/makeLayout';

/**
 * Interface for specifying props for the IBoxLayout class.
 *
 * @template Data - The type of data for the layout.
 * @template Payload - The type of payload for the layout.
 */
export interface IBoxLayoutProps<Data = IAnything, Payload = IAnything> extends IWrappedLayout<Data, Payload> {
    className?: PickProp<IField<Data, Payload>, 'className'>;
    style?: PickProp<IField<Data, Payload>, 'style'>;
    sx?: PickProp<IField<Data, Payload>, 'sx'>;
}

/**
 * Represents a private interface for a BoxLayout component.
 *
 * @interface IBoxLayoutPrivate
 * @extends {IEntity<Data>}
 * @template Data - The type of data associated with the BoxLayout.
 */
interface IBoxLayoutPrivate<Data = IAnything> extends IEntity<Data> {
    children?: React.ReactNode;
}

/**
 * A custom component for layouting its children in a box.
 *
 * @param props - The properties for the BoxLayout component.
 * @param props.children - The children elements to be rendered within the box layout.
 * @param props.className - The optional CSS class for styling the box layout.
 * @param props.style - The optional inline style object for further customization.
 * @param props.sx - The optional theme-ui style object for additional theming.
 * @typeparam {Data} - The type of the data object that can be passed to the layout.
 * @extends {IBoxLayoutProps<Data>} - The properties specific to the BoxLayout component.
 * @extends {IBoxLayoutPrivate<Data>} - The private properties specific to the BoxLayout component.
 * @returns - A JSX element representing the box layout component.
 */
export const BoxLayout = <Data extends IAnything = IAnything>({
    children,
    className,
    style,
    sx,
    testId,
}: IBoxLayoutProps<Data> & IBoxLayoutPrivate<Data>) => (
    <Box
        className={className}
        style={style}
        sx={sx}
        data-testid={testId}
    >
        {children}
    </Box>
);

BoxLayout.displayName = 'BoxLayout';

export default makeLayout(BoxLayout) as typeof BoxLayout;
