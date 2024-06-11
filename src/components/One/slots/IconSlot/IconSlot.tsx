import * as React from 'react';
import { useContext } from 'react';

import { SlotContext } from '../../components/SlotFactory';

import IIconSlot from './IIconSlot';

/**
 * Represents a checkbox slot component.
 *
 * @param props - The props for the checkbox slot component.
 * @returns - The rendered checkbox element.
 */
export const IconSlot = (props: IIconSlot) => {
    const { Icon } = useContext(SlotContext);
    return <Icon {...props} />;
};

export default IconSlot;
