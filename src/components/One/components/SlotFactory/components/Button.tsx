import * as React from 'react';

import ActionButton from '../../../../ActionButton';

import { IButtonSlot } from '../../../slots/ButtonSlot';

/**
 * Represents a button component.
 */
export const Button = ({
    disabled,
    click,
    icon: Icon,
    title,
    value,
    placeholder,
    buttonVariant,
    buttonSize,
    buttonColor,
}: IButtonSlot) => (
    <ActionButton
        variant={buttonVariant}
        size={buttonSize}
        color={buttonColor}
        startIcon={Icon && <Icon />}
        disabled={disabled}
        onClick={click}
    >
        {value || title || placeholder}
    </ActionButton>
);

export default Button;
