import * as React from 'react';

import { Autocomplete } from "@material-ui/lab";
import { Chip, TextField as MatTextField } from "@material-ui/core";

import arrays from '../../../utils/arrays';
import objects from '../../../utils/objects';

import { IItemsSlot } from '../../../slots/ItemsSlot';

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
}: IItemsSlot) => (
    <Autocomplete
        multiple
        onChange={({ }, v) => onChange(objects(v))}
        value={value ? Object.values<any>(value) : []}
        options={arrays(itemList) || []}
        disabled={disabled}
        getOptionLabel={(s) => (tr(s) || "").toString()}
        renderTags={(value, getTagProps) =>
            value.map((option, index) => (
                <Chip
                    variant={outlined ? "outlined" : "default"}
                    label={option}
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
            />
        )}
    />
);

export default Items;
