import * as React from 'react';
import { useContext } from 'react';

import { SlotContext } from '../../components/SlotFactory';

import IYesNoSlot from './IYesNoSlot';

export const YesNoSlot = (props: IYesNoSlot) => {
    const { YesNo } = useContext(SlotContext);
    return <YesNo {...props} />;
};

export default YesNoSlot;
