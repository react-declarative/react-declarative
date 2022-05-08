import * as React from 'react';
import { useContext } from 'react';

import { SlotContext } from '../../components/SlotFactory';

import IActionAddSlot from './IActionAddSlot';

export const ActionAddSlot = (props: IActionAddSlot) => {
    const { ActionAdd } = useContext(SlotContext);
    return <ActionAdd {...props} />;
};

export default ActionAddSlot;
