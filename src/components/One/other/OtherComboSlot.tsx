import * as React from 'react';

import CircularProgress from '@mui/material/CircularProgress';
import Autocomplete from "@mui/material/Autocomplete";
import MatTextField from "@mui/material/TextField";

import { IComboSlot } from '../slots/ComboSlot';

import { useOneProps } from '../context/PropsProvider';
import { useOneState } from '../context/StateProvider';
import useItemList from './useItemList';

/**
 * OtherComboSlot is a component that renders a combo slot with autocomplete functionality.
 *
 * @param value - The value of the combo slot.
 * @param disabled - Indicates whether the combo slot is disabled.
 * @param readonly - Indicates whether the combo slot is readonly.
 * @param description - The description of the combo slot.
 * @param placeholder - The placeholder text for the combo slot.
 * @param outlined - Indicates whether the combo slot should be outlined.
 * @param itemList - The list of item objects for the combo slot.
 * @param title - The title of the combo slot.
 * @param dirty - Indicates whether the combo slot has been modified.
 * @param invalid - Indicates whether the combo slot is invalid.
 * @param tr - A translation function to translate strings.
 * @param onChange - The callback function when the combo slot value changes.
 * @returns - The rendered combo slot component.
 */
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
