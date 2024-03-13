import * as React from 'react';
import { useContext } from 'react';

import { SlotContext } from '../../components/SlotFactory';

import IYesNoSlot from './IYesNoSlot';

/**
 * Represents a slot for yes/no values.
 * @param props - The props for the YesNoSlot component.
 * @param props.YesNo - The YesNo component provided by the SlotContext.
 * @returns - The rendered YesNo component.
 */
export const YesNoSlot = (props: IYesNoSlot) => {
    const { YesNo } = useContext(SlotContext);
    return <YesNo {...props} />;
};

export default YesNoSlot;
