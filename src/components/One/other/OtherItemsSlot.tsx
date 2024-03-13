import * as React from 'react';

import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import MatTextField from "@mui/material/TextField";
import Chip from "@mui/material/Chip";

import { IItemsSlot } from '../slots/ItemsSlot';

import { useOneProps } from '../context/PropsProvider';
import { useOneState } from '../context/StateProvider';
import { useItemList } from './useItemList';

/**
 * Represents an input field for selecting multiple items from a list.
 *
 * @param OtherItemsSlot - The configuration object for the OtherItemsSlot component.
 * @param OtherItemsSlot.value - The current selected value(s) for the input field.
 * @param OtherItemsSlot.disabled - Determines if the input field is disabled or not.
 * @param OtherItemsSlot.readonly - Determines if the input field is read-only or not.
 * @param OtherItemsSlot.description - The description text for the input field.
 * @param OtherItemsSlot.placeholder - The input field's placeholder text.
 * @param [OtherItemsSlot.outlined=false] - Determines if the input field is outlined or not.
 * @param [OtherItemsSlot.itemList=[]] - The list of items to be displayed in the autocomplete dropdown.
 * @param OtherItemsSlot.dirty - Indicates if the input field has been modified.
 * @param OtherItemsSlot.invalid - Indicates if the input field's value is not valid.
 * @param OtherItemsSlot.title - The title of the input field.
 * @param [OtherItemsSlot.tr=(s) => s.toString()] - The translation function for the labels in the dropdown.
 * @param OtherItemsSlot.onChange - The event handler function for when the selected value(s) change.
 *
 * @returns - The OtherItemsSlot component.
 */
export const OtherItemsSlot = ({
    value,
    disabled,
    readonly,
    description,
    placeholder,
    outlined = false,
    itemList = [],
    dirty,
    invalid,
    title,
    tr = (s) => s.toString(),
    onChange,
}: IItemsSlot) => {
    const { payload = {} } = useOneProps();
    const { object } = useOneState<any>();
    const {
        items: options,
        labels,
        loading,
        loaded,
    } = useItemList({
        itemList: itemList || [],
        payload,
        object,
        tr,
    });
    return (
        <Autocomplete
            multiple
            onChange={({ }, v) => onChange(v.length ? v : null)}
            getOptionLabel={(v) => labels[v] || ''}
            value={loaded ? value ? Object.values<string>(value) : [] : []}
            options={options}
            loading={loading}
            disabled={disabled}
            renderTags={(value, getTagProps) =>
                value.map((option: string, index) => (
                    <Chip
                        variant={outlined ? "outlined" : "filled"}
                        label={labels[option]}
                        {...getTagProps({ index })}
                    />
                ))
            }
            renderInput={(params) => (
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
            )}
        />
    );
};

export default OtherItemsSlot;
