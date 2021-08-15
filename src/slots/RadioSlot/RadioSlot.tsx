import * as React from 'react';
import { useContext } from 'react';

import { SlotContext } from '../../components/SlotFactory';

import IRadioSlot from './IRadioSlot';

export const RadioSlot = (props: IRadioSlot) => {
    const { Radio } = useContext(SlotContext);
    return <Radio {...props} />;
};

export default RadioSlot;
