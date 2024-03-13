import * as React from 'react';
import { useContext } from 'react';

import { SlotContext } from '../../components/SlotFactory';

import ICheckBoxSlot from './ICheckBoxSlot';

/**
 * Represents a checkbox slot component.
 *
 * @param props - The props for the checkbox slot component.
 * @returns - The rendered checkbox element.
 */
export const CheckBoxSlot = (props: ICheckBoxSlot) => {
    const { CheckBox } = useContext(SlotContext);
    return <CheckBox {...props} />;
};

export default CheckBoxSlot;
