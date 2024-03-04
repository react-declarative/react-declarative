import * as React from 'react';

import CircularProgress from '@mui/material/CircularProgress';
import Autocomplete from "@mui/material/Autocomplete";
import MatTextField from "@mui/material/TextField";

import { IComboSlot } from '../slots/ComboSlot';

import { useOneProps } from '../context/PropsProvider';
import { useOneState } from '../context/StateProvider';
import useItemList from './useItemList';

export const OtherComboSlot = ({
  value,
  disabled,
  readonly,
  description = "",
  placeholder = "",
  outlined = false,
  itemList = [],
  title = "",
  dirty,
  invalid,
  tr = (s) => s.toString(),
  onChange,
}: IComboSlot) => {
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

export default OtherComboSlot;
