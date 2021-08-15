import * as React from 'react';
import { useContext } from 'react';

import { SlotContext } from '../../components/SlotFactory';

import IRatingSlot from './IRatingSlot';

export const RatingSlot = (props: IRatingSlot) => {
    const { Rating } = useContext(SlotContext);
    return <Rating {...props} />;
};

export default RatingSlot;
