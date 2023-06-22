import * as React from 'react';
import { useContext } from 'react';

import { SlotContext } from '../../components/SlotFactory';

import IChooseSlot from './IChooseSlot';

export const ChooseSlot = (props: IChooseSlot) => {
    const { Choose } = useContext(SlotContext);
    return <Choose {...props} />;
};

export default ChooseSlot;
