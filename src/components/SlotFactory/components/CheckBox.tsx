import * as React from 'react';

import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';

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
                onChange={() => onChange(!value)}
            />}
            label={title} />
    </FormGroup>
);

export default CheckBox;
