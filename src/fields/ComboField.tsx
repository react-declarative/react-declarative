import * as React from "react";

import { Autocomplete } from "@material-ui/lab";
import { TextField as MatTextField } from "@material-ui/core";

import makeField from "../components/makeField";
import IManaged, { PickProp } from "../model/IManaged";
import IAnything from "../model/IAnything";
import IField from "../model/IField";

export interface IComboFieldProps {
  description?: PickProp<IField, "description">;
  placeholder?: PickProp<IField, "placeholder">;
  outlined?: PickProp<IField, "outlined">;
  itemList?: PickProp<IField, "itemList">;
  title?: PickProp<IField, "title">;
  tr?: PickProp<IField, "tr">;
}

interface IComboFieldPrivate {
  value: PickProp<IManaged, "value">;
  disabled: PickProp<IManaged, "disabled">;
  onChange: PickProp<IManaged, "onChange">;
}

export const ComboField = ({
  value,
  disabled,
  description = "",
  placeholder = "",
  outlined = true,
  itemList = [],
  title = "",
  tr = (s) => s as IAnything,
  onChange,
}: IComboFieldProps & IComboFieldPrivate) => (
  <Autocomplete
    value={value || null}
    onChange={({}, v) => onChange(v)}
    getOptionLabel={(s) => (tr(s) || "").toString()}
    options={itemList || []}
    disabled={disabled}
    renderInput={(params) => (
      <MatTextField
        {...params}
        variant={outlined ? "outlined" : "standard"}
        helperText={description}
        label={title}
        placeholder={placeholder}
      />
    )}
  />
);

ComboField.displayName = "ComboField";

export default makeField(ComboField, true);
