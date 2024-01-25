import * as React from 'react';
import { useContext } from 'react';

import { SlotContext } from '../../components/SlotFactory';

import IDictSlot from './IDictSlot';

export const DictSlot = (props: IDictSlot) => {
    const { Dict } = useContext(SlotContext);
    return <Dict {...props} />;
};

export default DictSlot;
