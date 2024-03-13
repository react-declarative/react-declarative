import * as React from 'react';
import { useContext } from 'react';

import { SlotContext } from '../../components/SlotFactory';

import IDictSlot from './IDictSlot';

/**
 * Represents a dictionary slot component.
 * @param props - The props object containing input data.
 * @returns The rendered dictionary slot.
 */
export const DictSlot = (props: IDictSlot) => {
    const { Dict } = useContext(SlotContext);
    return <Dict {...props} />;
};

export default DictSlot;
