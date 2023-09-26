import * as React from 'react';
import { useCallback, useEffect } from 'react';

import FormControlLabel from "@mui/material/FormControlLabel";
import RadioGroup from "@mui/material/RadioGroup";
import FormGroup from "@mui/material/FormGroup";
import MatRadio from "@mui/material/Radio";

import { useOneRadio } from '../../../context/RadioProvider';

import useActualValue from '../../../../../hooks/useActualValue';

import { IRadioSlot } from '../../../slots/RadioSlot';

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
                name={name}
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
