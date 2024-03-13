import * as React from 'react';
import { useContext } from 'react';

import { SlotContext } from '../../components/SlotFactory';

import IRatingSlot from './IRatingSlot';

/**
 * Renders a component that displays a rating using the Rating component from the SlotContext.
 *
 * @param props - The properties to be passed to the Rating component.
 * @returns - The rendered component.
 */
export const RatingSlot = (props: IRatingSlot) => {
    const { Rating } = useContext(SlotContext);
    return <Rating {...props} />;
};

export default RatingSlot;
