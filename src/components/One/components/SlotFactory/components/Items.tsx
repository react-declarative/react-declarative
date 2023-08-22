import * as React from 'react';
import { useMemo, useState, useRef } from 'react';

import { AutocompleteRenderGetTagProps, AutocompleteRenderOptionState } from "@mui/material/Autocomplete";
import { AutocompleteRenderInputParams } from "@mui/material/Autocomplete";

import Autocomplete from "@mui/material/Autocomplete";

import CircularProgress from "@mui/material/CircularProgress";
import MatTextField from "@mui/material/TextField";
import Checkbox from '@mui/material/Checkbox';
import Chip from "@mui/material/Chip";

import Async from '../../../../Async';

import compareArray from '../../../../../utils/compareArray';
import randomString from '../../../../../utils/randomString';
import isObject from '../../../../../utils/isObject';
import objects from '../../../../../utils/objects';
import arrays from '../../../../../utils/arrays';

import { useOneState } from '../../../context/StateProvider';
import { useOneProps } from '../../../context/PropsProvider';
import { useOnePayload } from '../../../context/PayloadProvider';

import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';

import { IItemsSlot } from '../../../slots/ItemsSlot';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const EMPTY_ARRAY = [] as any;

const getArrayHash = (value: any) =>
    Object.values<string>(value || {})
        .sort((a, b) => b.localeCompare(a))
        .join('-');

export const Items = ({
    value: upperValue,
    disabled,
    readonly,
    description,
    placeholder,
    outlined = true,
    itemList = [],
    keepSync,
    freeSolo,
    dirty,
    invalid,
    title,
    tr = (s) => s.toString(),
    shouldUpdateItemList: shouldUpdate = () => false,
    onChange,
}: IItemsSlot) => {

    const { object: upperObject } = useOneState();
    const payload = useOnePayload();

    const value = useMemo(() => {
        if (typeof upperValue === 'string') {
            return [upperValue];
        }
        if (upperValue) {
            const result = Object.values(upperValue);
            return isObject(result) ? [] : result;
        }
        return [];
    }, [upperValue]);

    const { fallback = (e: Error) => {
        throw e;
    } } = useOneProps();

    const initialObject = useRef(upperObject);
    const prevObject = useRef<any>(null);

    const object = useMemo(() => {
        if (!shouldUpdate(prevObject.current, upperObject, payload)) {
            return prevObject.current || initialObject.current;
        } else {
            prevObject.current = upperObject;
            return prevObject.current;
        }
    }, [upperObject]);

    const valueHash = getArrayHash(value);

    const reloadCondition = useMemo(() => randomString(), [
        valueHash,
        disabled,
        dirty,
        invalid,
        object,
        readonly,
    ]);

    const createRenderTags = (labels: Record<string, any>) => (value: any[], getTagProps: AutocompleteRenderGetTagProps) => {
        return value.map((option: string, index: number) => (
            <Chip
                variant={outlined ? "outlined" : "filled"}
                label={freeSolo ? option : (labels[option] || `${option} (unknown)`)}
                {...getTagProps({ index })}
            />
        ))
    };

    const createGetOptionLabel = (labels: Record<string, any>) => (v: string) => {
        if (freeSolo) {
            return v;
        }
        return labels[v] || `${v} (unknown)`;
    };

    const createRenderInput = (loading: boolean, readonly: boolean) => (params: AutocompleteRenderInputParams) => (
        <MatTextField
            variant={outlined ? "outlined" : "standard"}
            {...params}
            label={title}
            placeholder={placeholder}
            helperText={(dirty && invalid) || description}
            error={dirty && invalid !== null}
            InputProps={{
                ...params.InputProps,
                readOnly: readonly,
                endAdornment: (
                    <>
                        {loading ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                    </>
                ),
            }}
        />
    );

    const createRenderOption = (labels: Record<string, any>) => (props: React.HTMLAttributes<HTMLLIElement>, option: any, state: AutocompleteRenderOptionState) => (
        <li {...props}>
            <Checkbox
                icon={icon}
                checkedIcon={checkedIcon}
                style={{ marginRight: 8 }}
                checked={state.selected}
            />
            {freeSolo ? option : (labels[option] || `${option} (unknown)`)}
        </li>
    );

    const Loader = () => (
        <Autocomplete
            multiple
            disableCloseOnSelect
            loading
            disabled
            freeSolo={freeSolo}
            onChange={() => null}
            value={EMPTY_ARRAY}
            options={EMPTY_ARRAY}
            getOptionLabel={createGetOptionLabel({})}
            renderTags={createRenderTags({})}
            renderInput={createRenderInput(true, true)}
            renderOption={createRenderOption({})}
        />
    );

    const Content = ({
        labels,
        options,
        data
    }: {
        labels: Record<string, any>;
        options: any[];
        data: any;
    }) => {
        const [unfocused, setUnfocused] = useState(keepSync ? false : true);
        const [value, setValue] = useState(data);

        const handleFocus = () => {
            if (!readonly) {
                setUnfocused(false);
            }
        };

        const handleBlur = () => {
            if (!readonly && !keepSync) {
                setUnfocused(true);
                if (!compareArray(data, value)) {
                    onChange(value?.length ? objects(value) : null)
                }
            }
        };

        const handleChange = (value: any) => {
            if (keepSync) {
                onChange(value?.length ? objects(value) : null);
            }
            setValue(value);
        };

        return (
            <Autocomplete
                multiple
                disableCloseOnSelect
                freeSolo={freeSolo}
                onFocus={handleFocus}
                onBlur={handleBlur}
                readOnly={readonly || unfocused}
                onChange={({ }, value) => handleChange(value)}
                getOptionLabel={createGetOptionLabel(labels)}
                value={value}
                options={options}
                disabled={disabled}
                renderTags={createRenderTags(labels)}
                renderInput={createRenderInput(false, readonly || unfocused)}
                renderOption={createRenderOption(labels)}
            />
        );
    };

    return (
        <Async Loader={Loader} payload={reloadCondition} fallback={fallback}>
            {async () => {

                const labels: Record<string, string> = {};
                itemList = arrays(itemList) || [];
                const options = Object.values(typeof itemList === 'function' ? await Promise.resolve(itemList(object, payload)) : itemList);
                await Promise.all(options.map(async (item) => labels[item] = await Promise.resolve(tr(item, object, payload))));

                return (
                    <Content
                        options={options}
                        labels={labels}
                        data={value}
                    />
                );
            }}
        </Async>
    );
};

export default Items;
