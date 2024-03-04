import * as React from 'react';
import { useContext } from 'react';

import { SlotContext } from '../../components/SlotFactory';

import ITreeSlot from './ITreeSlot';

export const TreeSlot = (props: ITreeSlot) => {
    const { Tree } = useContext(SlotContext);
    return <Tree {...props} />;
};

export default TreeSlot;
