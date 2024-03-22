import * as React from 'react';
import { useContext } from 'react';

import { SlotContext } from '../../components/SlotFactory';

import IHeadRowSlot from './IHeadRowSlot';

/**
 * Represents a slot component for displaying a head row in a table.
 * @param props - The props for the component.
 * @returns The rendered head row slot component.
 */
export const HeadRowSlot = (props: IHeadRowSlot) => {
    const { HeadRow } = useContext(SlotContext);
    return <HeadRow {...props} />;
};

export default HeadRowSlot;
