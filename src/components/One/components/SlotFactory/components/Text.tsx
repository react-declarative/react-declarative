import * as React from 'react';
import { useMemo, useRef, useLayoutEffect } from 'react';

import IconButton from "@mui/material/IconButton";
import MatTextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import CircularProgress from "@mui/material/CircularProgress";

import { useOnePayload } from '../../../context/PayloadProvider';
import { useOneState } from '../../../context/StateProvider';

import { ITextSlot } from '../../../slots/TextSlot';

import IManaged, { PickProp } from '../../../../../model/IManaged';
import { IField } from '../../../../../model/IField';
import IAnything from '../../../../../model/IAnything';

import formatText from '../../../../../utils/formatText';

const LOADING_LABEL = 'Loading';
const NEVER_POS = Symbol('never-pos');

const icons = (
    data: IAnything,
    payload: IAnything,
    leadingIcon: React.ComponentType<any> | undefined,
    trailingIcon: React.ComponentType<any> | undefined,
    leadingIconClick: PickProp<IField, 'leadingIconClick'>,
    trailingIconClick: PickProp<IField, 'trailingIconClick'>,
    loading: boolean,
    disabled: boolean,
    readonly: boolean,
    v: string,
    c: PickProp<IManaged, 'onChange'>,
    cc: (data: IAnything) => void,
    leadingIconRipple: boolean,
    trailingIconRipple: boolean,
) => ({
    ...(leadingIcon
        ? {
            startAdornment: (
                <InputAdornment position="start">
                    <IconButton
                        edge="start"
                        disabled={disabled}
                        disableRipple={!leadingIconRipple}
                        onClick={() => {
                            if (leadingIconClick) {
                                leadingIconClick(v as unknown as IAnything, data, payload, (v) => c(v, {
                                    skipReadonly: true,
                                }), cc);
                            }
                        }}
                    >
                        {React.createElement(leadingIcon, { data, payload, disabled, readonly })}
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
                        disableRipple={!trailingIconRipple}
                        onClick={() => {
                            if (trailingIconClick) {
                                trailingIconClick(v as unknown as IAnything, data, payload, (v) => c(v, {
                                    skipReadonly: true,
                                }), cc);
                            }
                        }}
                    >
                        {React.createElement(trailingIcon, { data, payload, disabled, readonly })}
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

const getCaretPos = (element: HTMLInputElement | HTMLTextAreaElement) => {
    return element.selectionStart || element.value.length;
};

export const Text = ({
    invalid,
    incorrect,
    value,
    disabled,
    readonly,
    inputType = "text",
    inputMode = "text",
    inputPattern = undefined,
    labelShrink,
    description = "",
    outlined = false,
    title = "",
    leadingIcon: li,
    trailingIcon: ti,
    leadingIconClick: lic,
    trailingIconClick: tic,
    leadingIconRipple: lir = true,
    trailingIconRipple: tir = true,
    inputRows: rows = 1,
    placeholder = "",
    inputAutocomplete: autoComplete = "off",
    inputFormatterSymbol: symbol = '0',
    inputFormatterAllowed: allowed,
    inputFormatterReplace: replace,
    inputFormatterTemplate: template = '',
    inputFormatter = (raw) => formatText(raw, template, {
        symbol,
        allowed,
        replace,
    }),
    dirty,
    loading,
    autoFocus,
    inputRef,
    onChange,
}: ITextSlot) => {
    const payload = useOnePayload();
    const { object, changeObject: handleChange } = useOneState<object>();

    const inputElementRef = useRef<HTMLInputElement | null>();

    const caretManager = useMemo(() => {
        let lastPos: symbol | number = NEVER_POS;

        const getAdjust = (pos: number) => {
            let adjust = 0;
            for (let i = Math.max(pos - 1, 0); i < template.length; i++) {
                const char = template[i];
                if (char === symbol) {
                    break;
                }
                adjust += 1;
            }
            return adjust;
        };

        return {
            render: () => {
                if (inputType !== 'text') {
                    return;
                }
                const { current: input } = inputElementRef;
                if (typeof lastPos === 'number') {
                    input?.setSelectionRange(lastPos, lastPos);
                    lastPos = NEVER_POS;
                }
            },
            pos: () => {
                const { current: input } = inputElementRef;
                if (input) {
                    lastPos = getCaretPos(input);
                    lastPos += getAdjust(lastPos);
                }
                return lastPos;
            },
        }
    }, []);

    useLayoutEffect(() => {
        if (!template) {
            return;
        }
        const { current: input } = inputElementRef;
        const handler = () => caretManager.pos();
        input && input.addEventListener('keyup', handler);
        input && input.addEventListener('click', handler);
        return () => {
            input && input.removeEventListener('keyup', handler);
            input && input.removeEventListener('click', handler);
        };
    }, [inputElementRef.current]);

    useLayoutEffect(() => {
        if (template) {
            caretManager.render();
        }
    }, [value]);

    return (
        <MatTextField
            sx={{
                ...(!outlined && {
                    position: 'relative',
                    mt: 1,
                    '& .MuiFormHelperText-root': {
                        position: 'absolute',
                        top: '100%',
                    },
                })
            }}
            inputRef={(input: HTMLInputElement | null) => {
                inputElementRef.current = input;
                inputRef && inputRef(input);
            }}
            variant={outlined ? "outlined" : "standard"}
            helperText={(dirty && (invalid || incorrect)) || description}
            error={dirty && (invalid !== null || incorrect !== null)}
            InputProps={{
                autoComplete: autoComplete,
                readOnly: readonly,
                inputMode,
                autoFocus,
                ...icons(object, payload, li, ti, lic, tic, loading, disabled, !!readonly, (value || '').toString(), onChange, handleChange, lir, tir),
            }}
            inputProps={{
                pattern: inputPattern,
            }}
            InputLabelProps={labelShrink ? {
                shrink: labelShrink,
            } : undefined}
            type={inputType}
            focused={autoFocus}
            autoComplete={autoComplete}
            value={loading ? LOADING_LABEL : String(value || '')}
            placeholder={placeholder}
            onChange={({ target }) => {
                let result = target.value;
                if (template) {
                    result = "";
                    for (let i = 0; i < target.value.length; i++) {
                        result += target.value[i];
                        result = inputFormatter(result);
                    }
                    caretManager.pos();
                }
                onChange(result);
            }}
            label={title}
            disabled={disabled}
            {...multiline(rows)}
        />
    );
}

export default Text;
