import * as React from 'react';
import { useCallback, useEffect } from 'react';

import FormControlLabel from "@mui/material/FormControlLabel";
import RadioGroup from "@mui/material/RadioGroup";
import FormGroup from "@mui/material/FormGroup";
import MatRadio from "@mui/material/Radio";

import { useOneRadio } from '../../../context/RadioProvider';

import useActualValue from '../../../../../hooks/useActualValue';

import { IRadioSlot } from '../../../slots/RadioSlot';

/**
 * Represents a radio component.
 *
 * @typedef  IRadioSlot
 * @property disabled - Determines if the radio component is disabled.
 * @property onChange - The function to be called when the value of the radio component changes.
 * @property title - The title of the radio component.
 * @property radioValue - The value of the radio component.
 * @property value - The current selected value of the radio component.
 * @property [name=''] - The name of the radio component.
 */
export const Radio = ({
    disabled,
    onChange,
    title,
    radioValue,
    value,
    name = '',
}: IRadioSlot) => {
    const [radioMap, setRadioMap] = useOneRadio();
    const radioMap$ = useActualValue(radioMap);

    const setValue = useCallback((value: string | null) => setRadioMap((prevRadioMap) => ({
        ...prevRadioMap,
        [name]: value,
    })), []);

    const handleChange = useCallback((value: string | null) => {
        setValue(value);
        onChange(value);
    }, []);

    useEffect(() => {
        const { current: radioMap } = radioMap$;
        if (value !== radioMap[name]) {
            setValue(value);
        }
    }, [value]);

    return (
        <FormGroup>
            <RadioGroup
                value={value}
                onChange={(_, value) => {
                    handleChange(value || null);
                }}
            >
                <FormControlLabel 
                    value={radioValue}
                    control={<MatRadio disabled={disabled} />}
                    label={title || ''}
                />
            </RadioGroup>
        </FormGroup>
    );
};

export default Radio;
