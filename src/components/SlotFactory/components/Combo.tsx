import * as React from 'react';

import CircularProgress from '@mui/material/CircularProgress';
import Autocomplete from "@mui/material/Autocomplete";
import MatTextField from "@mui/material/TextField";

import arrays from '../../../utils/arrays';

import { IComboSlot } from '../../../slots/ComboSlot';

import useItemList from '../hooks/useItemList';

export const Combo = ({
  value,
  disabled,
  description = "",
  placeholder = "",
  outlined = true,
  itemList = [],
  title = "",
  dirty,
  invalid,
  tr = (s) => s.toString(),
  onChange,
}: IComboSlot) => {
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
      value={loaded ? (value || null) : null}
      onChange={({ }, v) => onChange(v)}
      getOptionLabel={(v) => labels[v] || ''}
      options={options}
      loading={loading}
      disabled={disabled}
      renderInput={(params) => (
        <MatTextField
          {...params}
          variant={outlined ? "outlined" : "standard"}
          label={title}
          placeholder={placeholder}
          helperText={(dirty && invalid) || description}
          error={dirty && invalid !== null}
          value={"123"}
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

export default Combo;
