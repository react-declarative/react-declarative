import * as React from 'react';

import ActionIcon from '../../../../ActionIcon';

import { IIconSlot } from '../../../slots/IconSlot';

import ArrowForward from '@mui/icons-material/ArrowForward';

/**
 * Represents a icon component.
 */
export const Icon = ({
    disabled,
    click,
    icon: Icon = ArrowForward,
}: IIconSlot) => (
    <ActionIcon
        disabled={disabled}
        onClick={click}
    >
        <Icon />
    </ActionIcon>
);

export default Icon;

