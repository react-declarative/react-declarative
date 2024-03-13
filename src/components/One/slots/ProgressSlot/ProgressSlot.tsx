import * as React from 'react';
import { useContext } from 'react';

import { SlotContext } from '../../components/SlotFactory';

import IProgressSlot from './IProgressSlot';

/**
 * Represents a Progress Slot component.
 *
 * @param props - The props passed to the component.
 * @returns - The rendered Progress component.
 */
export const ProgressSlot = (props: IProgressSlot) => {
    const { Progress } = useContext(SlotContext);
    return <Progress {...props} />;
};

export default ProgressSlot;
