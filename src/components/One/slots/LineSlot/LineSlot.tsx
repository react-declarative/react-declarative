import * as React from 'react';
import { useContext } from 'react';

import { SlotContext } from '../../components/SlotFactory';

import ILineSlot from './ILineSlot';

export const LineSlot = (props: ILineSlot) => {
    const { Line } = useContext(SlotContext);
    return <Line {...props} />;
};

export default LineSlot;
