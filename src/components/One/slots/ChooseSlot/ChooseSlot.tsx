import * as React from 'react';
import { useContext } from 'react';

import { SlotContext } from '../../components/SlotFactory';

import IChooseSlot from './IChooseSlot';

/**
 * Renders the component by passing the properties to the Choose component obtained from the SlotContext.
 *
 * @param props - The properties for the ChooseSlot component.
 * @returns - The rendered Choose component.
 */
export const ChooseSlot = (props: IChooseSlot) => {
    const { Choose } = useContext(SlotContext);
    return <Choose {...props} />;
};

export default ChooseSlot;
