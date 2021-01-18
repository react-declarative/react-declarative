import * as React from "react";

import { Autocomplete } from "@material-ui/lab";
import { Chip, TextField as MatTextField } from "@material-ui/core";

import makeField from "../components/makeField";
import IManaged, { PickProp } from "../model/IManaged";
import IField from "../model/IField";
import IAnything from "../model/IAnything";

export interface IItemsFieldProps {
  description?: PickProp<IField, "description">;
  placeholder?: PickProp<IField, "placeholder">;
  outlined?: PickProp<IField, "outlined">;
  itemList?: PickProp<IField, "itemList">;
  title?: PickProp<IField, "title">;
  tr?: PickProp<IField, "tr">;
}

interface IItemsFieldPrivate {
  onChange: PickProp<IManaged, "onChange">;
  value: PickProp<IManaged, 'value'>;
  disabled: PickProp<IManaged, "disabled">;
}

export const ItemsField = ({
  value,
  disabled,
  description,
  placeholder,
  outlined = true,
  itemList = [],
  title,
  tr = (s) => s as IAnything,
  onChange,
}: IItemsFieldProps & IItemsFieldPrivate) => (
  <Autocomplete
    multiple
    onChange={({}, v) => onChange(v as unknown as IAnything[])}
    options={itemList}
    disabled={disabled}
    value={value || null}
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
        helperText={description}
      />
    )}
  />
);

ItemsField.displayName = 'ItemsField';

export default makeField(ItemsField, true);
