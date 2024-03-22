import * as React from 'react';
import { useContext } from 'react';

import { SlotContext } from '../../components/SlotFactory';

import IBodyRowSlot from './IBodyRowSlot';

/**
 * Function that renders a body row slot component.
 *
 * @param props - The props object containing the properties for the body row slot component.
 * @returns - The rendered body row component.
 */
export const BodyRowSlot = (props: IBodyRowSlot) => {
    const { BodyRow } = useContext(SlotContext);
    return <BodyRow {...props} />;
};

export default BodyRowSlot;
