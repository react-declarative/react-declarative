import * as React from 'react';
import { useContext } from 'react';

import { SlotContext } from '../../components/SlotFactory';

import ITypographySlot from './ITypographySlot';

/**
 * Represents a slot for typography components.
 * @param props - The properties for the typography slot.
 * @returns A typography component.
 */
export const TypographySlot = (props: ITypographySlot) => {
    const { Typography } = useContext(SlotContext);
    return <Typography {...props} />;
};

export default TypographySlot;
