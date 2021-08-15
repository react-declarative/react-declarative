import * as React from 'react';

import FormControlLabel from "@material-ui/core/FormControlLabel";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormGroup from "@material-ui/core/FormGroup";
import MatRadio from "@material-ui/core/Radio";

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
            <FormControlLabel value={radioValue} control={<MatRadio disabled={disabled} />} label={title} />
        </RadioGroup>
    </FormGroup>
);

export default Radio;
