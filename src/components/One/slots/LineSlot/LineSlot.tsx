import * as React from 'react';
import { useContext } from 'react';

import { SlotContext } from '../../components/SlotFactory';

import ILineSlot from './ILineSlot';

/**
 * Represents a Line Slot component.
 *
 * @param props - The props passed to the component.
 * @returns - The rendered Line component along with the props passed to it.
 */
export const LineSlot = (props: ILineSlot) => {
    const { Line } = useContext(SlotContext);
    return <Line {...props} />;
};

export default LineSlot;
