import * as React from 'react';
import { useContext } from 'react';

import { SlotContext } from '../../components/SlotFactory';

import IDateSlot from './IDateSlot';

export const DateSlot = (props: IDateSlot) => {
    const { Date } = useContext(SlotContext);
    return <Date {...props} />;
};

export default DateSlot;
