import * as React from 'react';
import { useContext } from 'react';

import { SlotContext } from '../../components/SlotFactory';

import IActionFabSlot from './IActionFabSlot';

export const ActionFabSlot = (props: IActionFabSlot) => {
    const { ActionFab } = useContext(SlotContext);
    return <ActionFab {...props} />;
};

export default ActionFabSlot;
