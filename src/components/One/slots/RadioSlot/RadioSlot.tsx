import * as React from 'react';
import { useContext } from 'react';

import { SlotContext } from '../../components/SlotFactory';

import IRadioSlot from './IRadioSlot';

/**
 * Represents a radio slot component.
 *
 * @param props - The props object for the radio slot component.
 * @returns - The rendered radio element.
 */
export const RadioSlot = (props: IRadioSlot) => {
    const { Radio } = useContext(SlotContext);
    return <Radio {...props} />;
};

export default RadioSlot;
