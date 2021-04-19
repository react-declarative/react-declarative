import * as React from "react";

import { Autocomplete } from "@material-ui/lab";
import { TextField as MatTextField } from "@material-ui/core";

import arrays from '../utils/arrays';

import makeField from "../components/makeField";

import IManaged, { PickProp } from "../model/IManaged";
import IAnything from "../model/IAnything";
import IField from "../model/IField";

export interface IComboFieldProps<Data = IAnything> {
  description?: PickProp<IField<Data>, "description">;
  placeholder?: PickProp<IField<Data>, "placeholder">;
  outlined?: PickProp<IField<Data>, "outlined">;
  itemList?: PickProp<IField<Data>, "itemList">;
  title?: PickProp<IField<Data>, "title">;
  tr?: PickProp<IField<Data>, "tr">;
}

interface IComboFieldPrivate<Data = IAnything>  {
  value: PickProp<IManaged<Data>, "value">;
  disabled: PickProp<IManaged<Data>, "disabled">;
  onChange: PickProp<IManaged<Data>, "onChange">;
  dirty: PickProp<IManaged<Data>, "dirty">;
  invalid: PickProp<IManaged<Data>, "invalid">;
}

export const ComboField = ({
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
}: IComboFieldProps & IComboFieldPrivate) => (
  <Autocomplete
    value={value || null}
    onChange={({}, v) => onChange(v)}
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

ComboField.displayName = "ComboField";

export default makeField(ComboField, true);
