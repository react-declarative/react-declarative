import * as React from 'react';
import { useContext } from 'react';

import { SlotContext } from '../../components/SlotFactory';

import ITimeSlot from './ITimeSlot';

/**
 * Represents a TimeSlot component.
 * @param props - The properties of the TimeSlot component.
 * @returns The rendered Time component.
 */
export const TimeSlot = (props: ITimeSlot) => {
    const { Time } = useContext(SlotContext);
    return <Time {...props} />;
};

export default TimeSlot;
