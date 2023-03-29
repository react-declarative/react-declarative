import * as React from 'react';

import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';

import { ICheckBoxSlot } from '../../../slots/CheckBoxSlot';

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
