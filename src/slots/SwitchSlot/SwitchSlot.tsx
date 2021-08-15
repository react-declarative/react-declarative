import * as React from 'react';
import { useContext } from 'react';

import { SlotContext } from '../../components/SlotFactory';

import ISwitchSlot from './ISwitchSlot';

export const SwitchSlot = (props: ISwitchSlot) => {
    const { Switch } = useContext(SlotContext);
    return <Switch {...props} />;
};

export default SwitchSlot;
