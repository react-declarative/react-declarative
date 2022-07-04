import * as React from 'react';
import { useContext } from 'react';

import { SlotContext } from '../../components/SlotFactory';

import IChipListSlot from './IChipListSlot';

export const ChipListSlot = (props: IChipListSlot) => {
    const { ChipListSlot } = useContext(SlotContext);
    return <ChipListSlot {...props} />;
};

export default ChipListSlot;
