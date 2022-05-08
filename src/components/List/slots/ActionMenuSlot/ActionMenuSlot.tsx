import * as React from 'react';
import { useContext } from 'react';

import { SlotContext } from '../../components/SlotFactory';

import IActionMenuSlot from './IActionMenuSlot';

export const ActionMenuSlot = (props: IActionMenuSlot) => {
    const { ActionMenu } = useContext(SlotContext);
    return <ActionMenu {...props} />;
};

export default ActionMenuSlot;
