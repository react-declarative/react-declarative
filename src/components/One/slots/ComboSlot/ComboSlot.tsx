import * as React from 'react';
import { useContext } from 'react';

import { SlotContext } from '../../components/SlotFactory';

import IComboSlot from './IComboSlot';

/**
 * Represents a combo slot component.
 *
 * @param props - The properties for the combo slot.
 * @returns A combo slot component.
 */
export const ComboSlot = (props: IComboSlot) => {
    const { Combo } = useContext(SlotContext);
    return <Combo {...props} />;
};

export default ComboSlot;
