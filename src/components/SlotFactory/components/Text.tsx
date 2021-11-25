import * as React from 'react';

import IconButton from "@material-ui/core/IconButton";
import MatTextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import CircularProgress from "@material-ui/core/CircularProgress";

import IManaged, { PickProp } from '../../../model/IManaged';
import { ITextSlot } from '../../../slots/TextSlot';
import { IField } from '../../../model/IField';

import IAnything from '../../../model/IAnything';

import icon from '../../../utils/createIcon';

const LOADING_LABEL = 'Loading';

const icons = (
    leadingIcon: string | React.ComponentType | undefined,
    trailingIcon: string | React.ComponentType | undefined,
    leadingIconClick: PickProp<IField, 'leadingIconClick'>,
    trailingIconClick: PickProp<IField, 'trailingIconClick'>,
    loading: boolean,
    v: string,
    c: PickProp<IManaged, 'onChange'>,
) => ({
    ...(leadingIcon
        ? {
            startAdornment: (
                <InputAdornment position="start">
                    <IconButton
                        edge="start"
                        onClick={() => {
                            if (leadingIconClick) {
                                leadingIconClick(v as unknown as IAnything, (v) => c(v, {
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
                        onClick={() => {
                            if (trailingIconClick) {
                                trailingIconClick(v as unknown as IAnything, (v) => c(v, {
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
                        <IconButton edge="end">
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

export const Text = ({
    invalid,
    value,
    disabled,
    inputType = "text",
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
}: ITextSlot) => (
    <MatTextField
        name={name}
        inputRef={inputRef}
        variant={outlined ? "outlined" : "standard"}
        helperText={(dirty && invalid) || description}
        error={dirty && invalid !== null}
        InputProps={{
            autoComplete: autoComplete,
            autoFocus: autoFocus,
            ...icons(li, ti, lic, tic, loading, (value || '').toString(), onChange),
        }}
        type={inputType}
        autoFocus={autoFocus}
        autoComplete={autoComplete}
        value={loading ? LOADING_LABEL : String(value)}
        placeholder={placeholder}
        onChange={({ target }) => onChange(target.value.toString())}
        label={title}
        disabled={disabled}
        {...multiline(rows)}
    />
);

export default Text;
