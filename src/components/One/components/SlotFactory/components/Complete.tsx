import * as React from 'react';
import { useState, useEffect, useMemo } from 'react';

import Popover from "@mui/material/Popover";
import IconButton from "@mui/material/IconButton";
import MatTextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import CircularProgress from "@mui/material/CircularProgress";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton from "@mui/material/ListItemButton";

import VirtualView from '../../../../VirtualView';

import { useOnePayload } from '../../../context/PayloadProvider';
import { useOneProps } from '../../../context/PropsProvider';
import { useOneState } from '../../../context/StateProvider';

import useActualValue from '../../../../../hooks/useActualValue';
import useDebounce from '../../../hooks/useDebounce';

import IManaged, { PickProp } from '../../../../../model/IManaged';
import { ICompleteSlot } from '../../../slots/CompleteSlot';
import { IField } from '../../../../../model/IField';
import IAnything from '../../../../../model/IAnything';

import icon from '../../../../../utils/createIcon';
import queued from '../../../../../utils/hof/queued';

const FETCH_DEBOUNCE = 500;

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
    placeholder = "",
    inputAutocomplete: autoComplete = "off",
    dirty,
    loading: upperLoading,
    itemList = ['unset'],
    autoFocus,
    inputRef,
    onChange,
    name,
}: ICompleteSlot) => {

    const payload = useOnePayload();

    const {
        fallback = (e: Error) => {
            throw e;
        }
    } = useOneProps();

    const {
        object,
    } = useOneState();

    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const anchorEl$ = useActualValue(anchorEl);
    
    const [currentLoading, setCurrentLoading] = useState(false);
    const [items, setItems] = useState<string[]>([]);

    const loading = upperLoading || currentLoading;
    const value$ = useActualValue(value);

    const [valueD, { pending }] = useDebounce(value, FETCH_DEBOUNCE);

    const handleRequest = useMemo(() => queued(async () => {
        setCurrentLoading(true);
        try {
            let items = typeof itemList === 'function' ? await itemList(object, payload) : itemList;
            if (Array.isArray(items)) {
                const template = String(value$.current).toLowerCase();
                items = items.filter((item) => item.toLowerCase().includes(template));
                setItems(items);
            } else {
                throw new Error('CompleteField itemList invalid result');
            }
        } catch (error: any) {
            fallback(error);
        } finally {
            setCurrentLoading(false);
        }
    }), []);

    useEffect(() => {
        if (!anchorEl$.current) {
            return;
        }
        handleRequest();
    }, [valueD, anchorEl]);

    const handleBlur = () => {
        let isOk = true;
        isOk = isOk && value;
        isOk = isOk && !pending();
        isOk = isOk && items.length === 1;
        if (isOk) {
            onChange(items[0]);
        }
        setAnchorEl(null);
    };

    return (
        <>
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
                value={String(value || '')}
                placeholder={placeholder}
                onChange={({ target }) => onChange(target.value)}
                onClick={({ currentTarget }) => setAnchorEl(currentTarget)}
                label={title}
                disabled={disabled}
            />
            <Popover
                open={!!anchorEl}
                anchorEl={anchorEl}
                onClose={handleBlur}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                disableAutoFocus
                disableEnforceFocus
                disableRestoreFocus
            >
                {!!anchorEl && (
                    <VirtualView
                        component={List}
                        sx={{
                            width: `${anchorEl?.clientWidth}px !important`,
                            height: 250,
                            mb: 1,
                        }}
                        minRowHeight={36}
                    >
                        {!items.length && (
                            <ListItem
                                disableGutters
                                dense
                            >
                                <ListItemButton
                                    disableRipple
                                    disableTouchRipple
                                >
                                    <ListItemText
                                        primary={loading ? "Loading" : "Nothing found"}
                                    />
                                </ListItemButton>
                            </ListItem>
                        )}
                        {items.map((value, idx) => (
                            <ListItem
                                disableGutters
                                dense
                                key={`${value}-${idx}`}
                            >
                                <ListItemButton
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        onChange(value);
                                        setAnchorEl(null);
                                    }}
                                >
                                    <ListItemText
                                        primary={value}
                                    />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </VirtualView>
                )}
            </Popover>
        </>
    );
}

export default Complete;
