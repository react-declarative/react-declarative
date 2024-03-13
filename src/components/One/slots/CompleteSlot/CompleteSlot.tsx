import * as React from 'react';
import { useContext } from 'react';

import { SlotContext } from '../../components/SlotFactory';

import ICompleteSlot from './ICompleteSlot';

/**
 * Represents a complete slot.
 *
 * @param props - The props for the complete slot.
 * @returns - The JSX element representing the complete slot.
 */
export const CompleteSlot = (props: ICompleteSlot) => {
    const { Complete } = useContext(SlotContext);
    return <Complete {...props} />;
};

export default CompleteSlot;
