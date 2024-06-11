import * as React from 'react';
import { useContext } from 'react';

import { SlotContext } from '../../components/SlotFactory';

import IButtonSlot from './IButtonSlot';

/**
 * Represents a checkbox slot component.
 *
 * @param props - The props for the checkbox slot component.
 * @returns - The rendered checkbox element.
 */
export const ButtonSlot = (props: IButtonSlot) => {
    const { Button } = useContext(SlotContext);
    return <Button {...props} />;
};

export default ButtonSlot;
