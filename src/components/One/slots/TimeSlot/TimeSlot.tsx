import * as React from 'react';
import { useContext } from 'react';

import { SlotContext } from '../../components/SlotFactory';

import ITimeSlot from './ITimeSlot';

export const TimeSlot = (props: ITimeSlot) => {
    const { Time } = useContext(SlotContext);
    return <Time {...props} />;
};

export default TimeSlot;
