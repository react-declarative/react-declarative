import * as React from 'react';

import IconButton from "@mui/material/IconButton";
import MatTextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import CircularProgress from "@mui/material/CircularProgress";

import { useOnePayload } from '../../../context/PayloadProvider';

import IManaged, { PickProp } from '../../../../../model/IManaged';
import { ICompleteSlot } from '../../../slots/CompleteSlot';
import { IField } from '../../../../../model/IField';
import IAnything from '../../../../../model/IAnything';

import icon from '../../../../../utils/createIcon';

const LOADING_LABEL = 'Loading';

const icons = (
    payload: IAnything,
    leadingIcon: string | React.ComponentType | undefined,
    trailingIcon: string | React.ComponentType | undefined,
    leadingIconClick: PickProp<IField, 'leadingIconClick'>,
    trailingIconClick: PickProp<IField, 'trailingIconClick'>,
    loading: boolean,
    disabled: boolean,
    v: string,
    c: PickProp<IManaged, 'onChange'>,
) => ({
    ...(leadingIcon
        ? {
            startAdornment: (
                <InputAdornment position="start">
                    <IconButton
                        edge="start"
                        disabled={disabled}
                        onClick={() => {
                            if (leadingIconClick) {
                                leadingIconClick(v as unknown as IAnything, payload, (v) => c(v, {
                                    skipReadonly: true,
                                }));
                            }
                        }}
                    >
                        {icon(leadingIcon)}
                    </IconButton>
                </InputAdornment>
            ),
        }
        : {}),
    ...(trailingIcon && !loading
        ? {
            endAdornment: (
                <InputAdornment position="end">
                    <IconButton
                        edge="end"
                        disabled={disabled}
                        onClick={() => {
                            if (trailingIconClick) {
                                trailingIconClick(v as unknown as IAnything, payload, (v) => c(v, {
                                    skipReadonly: true,
                                }));
                            }
                        }}
                    >
                        {icon(trailingIcon)}
                    </IconButton>
                </InputAdornment>
            ),
        }
        : {}),
    ...(loading
        ? {
            endAdornment: (
                <InputAdornment position="end">
                    <IconButton disabled={disabled} edge="end">
                        <CircularProgress color="inherit" size={20} />
                    </IconButton>
                </InputAdornment>
            ),
        }
        : {}),
});

const multiline = (inputRows: number) => ({
    multiline: inputRows > 1,
    rows: inputRows,
});

export const Complete = ({
    invalid,
    value,
    disabled,
    readonly,
    inputType = "text",
    inputMode = "text",
    inputPattern = undefined,
    description = "",
    outlined = true,
    title = "",
    leadingIcon: li,
    trailingIcon: ti,
    leadingIconClick: lic,
    trailingIconClick: tic,
    inputRows: rows = 1,
    placeholder = "",
    inputAutocomplete: autoComplete = "off",
    dirty,
    loading,
    autoFocus,
    inputRef,
    onChange,
    name,
}: ICompleteSlot) => {
    const payload = useOnePayload();
    return (
        <MatTextField
            name={name}
            inputRef={inputRef}
            variant={outlined ? 'outlined' : 'standard'}
            helperText={(dirty && invalid) || description}
            error={dirty && invalid !== null}
            InputProps={{
                autoComplete,
                readOnly: readonly,
                inputMode,
                autoFocus,
                ...icons(
                    payload,
                    li,
                    ti,
                    lic,
                    tic,
                    loading,
                    disabled,
                    (value || '').toString(),
                    onChange,
                ),
            }}
            inputProps={{
                pattern: inputPattern,
            }}
            type={inputType}
            focused={autoFocus}
            autoComplete={autoComplete}
            value={loading ? LOADING_LABEL : String(value)}
            placeholder={placeholder}
            onChange={({ target }) => onChange(target.value)}
            label={title}
            disabled={disabled}
            {...multiline(rows)}
        />
    );
}

export default Complete;