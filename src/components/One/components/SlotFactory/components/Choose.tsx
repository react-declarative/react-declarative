import * as React from 'react';
import { useState, forwardRef } from 'react';

import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";

import ActionButton from '../../../../ActionButton';
import Async from '../../../../Async';

import { IChooseSlot } from '../../../slots/ChooseSlot';

import { useOnePayload } from '../../../context/PayloadProvider';
import { useOneState } from '../../../context/StateProvider';

export const Choose = ({
    invalid,
    value,
    disabled,
    readonly,
    description = "",
    outlined = true,
    title = "",
    placeholder = "No Choose chosen",
    dirty,
    loading: upperLoading,
    inputRef,
    onChange,
    choose = () => "unknown",
    tr = (value) => value,
    name,
}: IChooseSlot) => {
    const [currentLoading, setCurrentLoading] = useState(false);
    const payload = useOnePayload();
    const { object } = useOneState();

    const loading = upperLoading || currentLoading;

    const Input: React.FC<any> = forwardRef(({ value, ...rest }, ref) => (
        <Async payload={value} Loader={() => <input {...rest} readOnly ref={ref} value="" type="text" />}>
            {async () => {
                const label = value ? await tr(value, object, payload) : '';
                return (
                    <input {...rest} readOnly ref={ref} value={label} type="text" />
                );
            }}
        </Async>
    ));

    return (
        <TextField
            sx={{ 
                flex: 1,
                pointerEvents: 'none',
                ...(!outlined && {
                    position: 'relative',
                    mt: 1,
                    '& .MuiFormHelperText-root': {
                        position: 'absolute',
                        top: '100%',
                    },
                })
            }}
            name={name}
            inputRef={inputRef}
            variant={outlined ? "outlined" : "standard"}
            helperText={(dirty && invalid) || description}
            error={dirty && invalid !== null}
            InputProps={{
                readOnly: true,
                inputComponent: Input,
                placeholder: loading ? "Loading..." : "Not chosen",
                endAdornment: (
                    <InputAdornment position="end">
                        <ActionButton
                            sx={{ pointerEvents: readonly ? 'none' : 'all', mb: outlined ? undefined : 1 }}
                            disabled={loading}
                            variant="outlined"
                            size="small"
                            color={value ? "secondary" : "primary"}
                            onLoadStart={() => setCurrentLoading(true)}
                            onLoadEnd={() => setCurrentLoading(false)}
                            onClick={async () => {
                                if (value) {
                                    onChange(null);
                                    return;
                                }
                                const pendingValue = await choose(object, payload);
                                onChange(pendingValue);
                            }}
                        >
                            {value && "Deselect"}
                            {!value && "Choose"}
                        </ActionButton>
                    </InputAdornment>
                ),
            }}
            InputLabelProps={{
                shrink: true,
            }}
            value={value || ""}
            placeholder={placeholder}
            label={title}
            disabled={disabled}
        />
    );
}

export default Choose;
