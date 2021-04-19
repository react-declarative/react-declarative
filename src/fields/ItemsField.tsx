import * as React from "react";

import { Autocomplete } from "@material-ui/lab";
import { Chip, TextField as MatTextField } from "@material-ui/core";

import makeField from "../components/makeField";

import arrays from '../utils/arrays';
import objects from '../utils/objects';

import IManaged, { PickProp } from "../model/IManaged";
import IAnything from "../model/IAnything";
import IField from "../model/IField";

export interface IItemsFieldProps<Data = IAnything> {
  description?: PickProp<IField<Data>, "description">;
  placeholder?: PickProp<IField<Data>, "placeholder">;
  outlined?: PickProp<IField<Data>, "outlined">;
  itemList?: PickProp<IField<Data>, "itemList">;
  title?: PickProp<IField<Data>, "title">;
  tr?: PickProp<IField<Data>, "tr">;
}

interface IItemsFieldPrivate<Data = IAnything> {
  onChange: PickProp<IManaged<Data>, "onChange">;
  value: PickProp<IManaged<Data>, 'value'>;
  disabled: PickProp<IManaged<Data>, "disabled">;
  dirty: PickProp<IManaged<Data>, "dirty">;
  invalid: PickProp<IManaged<Data>, "invalid">;
}

export const ItemsField = ({
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
}: IItemsFieldProps & IItemsFieldPrivate) => (
  <Autocomplete
    multiple
    onChange={({}, v) => onChange(objects(v))}
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

ItemsField.displayName = 'ItemsField';

export default makeField(ItemsField, true);
