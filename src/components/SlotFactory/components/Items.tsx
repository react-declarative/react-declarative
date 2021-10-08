import * as React from 'react';

import Autocomplete from "@material-ui/lab/Autocomplete";
import CircularProgress from "@material-ui/core/CircularProgress";
import MatTextField from "@material-ui/core/TextField";
import Chip from "@material-ui/core/Chip";

import arrays from '../../../utils/arrays';
import objects from '../../../utils/objects';

import { IItemsSlot } from '../../../slots/ItemsSlot';

import useItemList from '../hooks/useItemList';

export const Items = ({
    value,
    disabled,
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
    const {
        items: options,
        labels,
        loading,
        loaded,
    } = useItemList({
        itemList: arrays(itemList) || [],
        tr,
    });
    return (
        <Autocomplete
            multiple
            onChange={({ }, v) => onChange(objects(v))}
            getOptionLabel={(v) => labels[v] || ''}
            value={loaded ? value ? Object.values<string>(value) : [] : []}
            options={options}
            loading={loading}
            disabled={disabled}
            renderTags={(value, getTagProps) =>
                value.map((option: string, index) => (
                    <Chip
                        variant={outlined ? "outlined" : "default"}
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

export default Items;
