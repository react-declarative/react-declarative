import * as React from 'react';

import Autocomplete from "@material-ui/lab/Autocomplete";
import MatTextField from "@material-ui/core/TextField";

import arrays from '../../../utils/arrays';

import { IComboSlot } from '../../../slots/ComboSlot';

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
}: IComboSlot) => (
  <Autocomplete
    value={value || null}
    onChange={({ }, v) => onChange(v)}
    getOptionLabel={(s) => (tr(s) || "").toString()}
    options={arrays(itemList) || []}
    disabled={disabled}
    renderInput={(params) => (
      <MatTextField
        {...params}
        variant={outlined ? "outlined" : "standard"}
        label={title}
        placeholder={placeholder}
        helperText={(dirty && invalid) || description}
        error={dirty && invalid !== null}
      />
    )}
  />
);

export default Combo;
