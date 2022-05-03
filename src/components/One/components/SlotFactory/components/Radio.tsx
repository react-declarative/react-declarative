import * as React from 'react';

import FormControlLabel from "@mui/material/FormControlLabel";
import RadioGroup from "@mui/material/RadioGroup";
import FormGroup from "@mui/material/FormGroup";
import MatRadio from "@mui/material/Radio";

import { IRadioSlot } from '../../../slots/RadioSlot';

export const Radio = ({
    disabled,
    value,
    onChange,
    title,
    radioValue,
    name = '',
}: IRadioSlot) => (
    <FormGroup>
        <RadioGroup
            name={name}
            value={value}
            onChange={() => onChange((radioValue || '').toString())}
        >
            <FormControlLabel 
                value={radioValue}
                control={<MatRadio disabled={disabled} />}
                label={title || ''}
            />
        </RadioGroup>
    </FormGroup>
);

export default Radio;
