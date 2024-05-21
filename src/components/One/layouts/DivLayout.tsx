import * as React from 'react';

import IField from '../../../model/IField';
import IEntity from '../../../model/IEntity';
import IAnything from '../../../model/IAnything';
import { IWrappedLayout, PickProp } from '../../../model/IManaged';

import makeLayout from '../components/makeLayout/makeLayout';

/**
 * Interface for specifying the props of a DivLayout component.
 * @template Data - The type of data that the DivLayout component uses.
 * @template Payload - The type of payload that the DivLayout component uses.
 * @extends IWrappedLayout<Data>
 */
export interface IDivLayoutProps<Data = IAnything, Payload = IAnything> extends IWrappedLayout<Data> {
    className?: PickProp<IField<Data, Payload>, 'className'>;
    style?: PickProp<IField<Data, Payload>, 'style'>;
    hidden?: PickProp<IField<Data, Payload>, 'hidden'>;
}

/**
 * Represents a private interface for the DivLayout class.
 *
 * @template Data - The data type for the entity.
 * @extends IEntity<Data>
 *
 * @property children - The child components to be rendered within the DivLayout.
 */
interface IDivLayoutPrivate<Data = IAnything> extends IEntity<Data> {
    children?: React.ReactNode;
}

/**
 * A layout component that renders a container <div> element with optional child elements.
 *
 * @template Data - A generic type that specifies additional data passed to the component.
 *
 * @param props - The properties of the DivLayout component.
 * @param props.children - The child elements to render inside the div container.
 * @param props.className - The CSS class name to apply to the div container.
 * @param props.style - The inline styles to apply to the div container.
 *
 * @returns The rendered DivLayout component.
 */
export const DivLayout = <Data extends IAnything = IAnything>({
    children,
    className,
    style,
    testId,
}: IDivLayoutProps<Data> & IDivLayoutPrivate<Data>) => (
    <div {...{className, style}} data-testid={testId}>
        {children}
    </div>
);

DivLayout.displayName = 'DivLayout';

export default makeLayout(DivLayout) as typeof DivLayout;
