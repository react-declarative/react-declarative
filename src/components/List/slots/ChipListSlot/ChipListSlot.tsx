import * as React from 'react';
import { useContext } from 'react';

import { SlotContext } from '../../components/SlotFactory';

import IChipListSlot from './IChipListSlot';

/**
 * Renders a chip list slot component.
 *
 * @param props - The props for the chip list slot.
 * @returns - The rendered chip list slot component.
 */
export const ChipListSlot = (props: IChipListSlot) => {
    const { ChipListSlot } = useContext(SlotContext);
    return <ChipListSlot {...props} />;
};

export default ChipListSlot;
