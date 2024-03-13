import * as React from 'react';
import { useContext } from 'react';

import { SlotContext } from '../../components/SlotFactory';

import ITreeSlot from './ITreeSlot';

/**
 * Represents a slot for a tree component.
 *
 * @param props - The props for the TreeSlot component.
 * @returns - The rendered Tree component.
 */
export const TreeSlot = (props: ITreeSlot) => {
    const { Tree } = useContext(SlotContext);
    return <Tree {...props} />;
};

export default TreeSlot;
