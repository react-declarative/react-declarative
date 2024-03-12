import * as React from 'react';

import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';

import { ICheckBoxSlot } from '../../../slots/CheckBoxSlot';

/**
 * Represents a checkbox component.
 *
 * @param disabled - Whether the checkbox is disabled or not.
 * @param onChange - The function to be called when the checkbox value changes.
 * @param title - The title or label for the checkbox.
 * @param value - The current value of the checkbox.
 * @returns - The rendered checkbox component.
 */
export const CheckBox = ({
    disabled,
    onChange,
    title,
    value,
}: ICheckBoxSlot) => (
    <FormGroup>
        <FormControlLabel
            control={<Checkbox
                disabled={disabled}
                checked={Boolean(value)}
                onChange={(_, checked) => onChange(checked)}
            />}
            label={title || ''} />
    </FormGroup>
);

export default CheckBox;
