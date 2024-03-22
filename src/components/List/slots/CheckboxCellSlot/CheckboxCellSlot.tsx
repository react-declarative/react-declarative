import * as React from 'react';
import { useContext } from 'react';

import { SlotContext } from '../../components/SlotFactory';

import ICheckboxCellSlot from './ICheckboxCellSlot';

/**
 * Renders a checkbox inside a cell slot.
 *
 * @param props - The props object for the checkbox cell slot.
 * @returns The rendered checkbox cell slot.
 */
export const CheckboxCellSlot = (props: ICheckboxCellSlot) => {
    const { CheckboxCell } = useContext(SlotContext);
    return <CheckboxCell {...props} />;
};

export default CheckboxCellSlot;
