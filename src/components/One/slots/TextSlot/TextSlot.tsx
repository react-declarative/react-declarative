import * as React from 'react';
import { useContext } from 'react';

import { SlotContext } from '../../components/SlotFactory';

import ITextSlot from './ITextSlot';

/**
 * Represents a text slot component.
 *
 * @param props - The properties to configure the component.
 * @returns - The rendered text component.
 */
export const TextSlot = (props: ITextSlot) => {
    const { Text } = useContext(SlotContext);
    return <Text {...props} />;
};

export default TextSlot;
