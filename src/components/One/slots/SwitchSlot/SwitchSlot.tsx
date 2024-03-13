import * as React from 'react';
import { useContext } from 'react';

import { SlotContext } from '../../components/SlotFactory';

import ISwitchSlot from './ISwitchSlot';

/**
 * Represents a Switch Slot component.
 *
 * @param props - The properties for the Switch Slot component.
 * @returns The rendered Switch component with the given properties.
 */
export const SwitchSlot = (props: ISwitchSlot) => {
    const { Switch } = useContext(SlotContext);
    return <Switch {...props} />;
};

export default SwitchSlot;
