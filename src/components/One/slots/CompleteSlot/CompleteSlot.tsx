import * as React from 'react';
import { useContext } from 'react';

import { SlotContext } from '../../components/SlotFactory';

import ICompleteSlot from './ICompleteSlot';

export const CompleteSlot = (props: ICompleteSlot) => {
    const { Complete } = useContext(SlotContext);
    return <Complete {...props} />;
};

export default CompleteSlot;
