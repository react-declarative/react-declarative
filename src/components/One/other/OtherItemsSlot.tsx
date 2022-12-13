import * as React from 'react';

import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import MatTextField from "@mui/material/TextField";
import Chip from "@mui/material/Chip";

import arrays from '../../../utils/arrays';
import objects from '../../../utils/objects';

import { IItemsSlot } from '../slots/ItemsSlot';

import { useOneProps } from '../context/PropsProvider';
import { useOneState } from '../context/StateProvider';
import useItemList from './useItemList';

export const OtherItemsSlot = ({
    value,
    disabled,
    readonly,
    description,
    placeholder,
    outlined = true,
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
        itemList: arrays(itemList) || [],
        payload,
        object,
        tr,
    });
    return (
        <Autocomplete
            multiple
            onChange={({ }, v) => onChange(v.length ? objects(v) : null)}
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
