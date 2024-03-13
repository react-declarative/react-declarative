import * as React from 'react';
import { useContext } from 'react';

import { SlotContext } from '../../components/SlotFactory';

import IDateSlot from './IDateSlot';

/**
 * Represents a DateSlot component.
 *
 * @param props - The props for the DateSlot component.
 * @returns - The rendered Date component.
 */
export const DateSlot = (props: IDateSlot) => {
    const { Date } = useContext(SlotContext);
    return <Date {...props} />;
};

export default DateSlot;
