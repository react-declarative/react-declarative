import * as React from 'react';
import { useContext } from 'react';

import { SlotContext } from '../../components/SlotFactory';

import IProgressSlot from './IProgressSlot';

export const ProgressSlot = (props: IProgressSlot) => {
    const { Progress } = useContext(SlotContext);
    return <Progress {...props} />;
};

export default ProgressSlot;
