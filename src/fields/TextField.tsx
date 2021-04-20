import * as React from "react";

import { IconButton, InputAdornment, TextField as MatTextField } from "@material-ui/core";

import makeField from "../components/makeField";
import IManaged, { PickProp } from "../model/IManaged";
import icon from '../utils/createIcon';
import IField from "../model/IField";
import IAnything from "../model/IAnything";

const icons = (
  leadingIcon: string | React.ComponentType | undefined,
  trailingIcon: string | React.ComponentType | undefined,
  leadingIconClick: PickProp<IField, 'leadingIconClick'>,
  trailingIconClick: PickProp<IField, 'trailingIconClick'>,
  v: string,
  c: PickProp<IManaged, 'onChange'>,
) => ({
  ...(leadingIcon
    ? {
        startAdornment: (
          <InputAdornment position="start">
            <IconButton
              edge="start"
              onClick={() => {
                if (leadingIconClick) {
                  leadingIconClick(v as unknown as IAnything, (v) => c(v, true));
                }
              }}
            >
              {icon(leadingIcon)}
            </IconButton>
          </InputAdornment>
        ),
      }
    : {}),
  ...(trailingIcon
    ? {
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              edge="end"
              onClick={() => {
                if (trailingIconClick) {
                  trailingIconClick(v as unknown as IAnything, (v) => c(v, true));
                }
              }}
            >
              {icon(trailingIcon)}
            </IconButton>
          </InputAdornment>
        ),
      }
    : {}),
});

const multiline = (inputRows: number) => ({
  multiline: inputRows > 1,
  rows: inputRows,
});

export interface ITextFieldProps<Data = IAnything> {
  inputType?: PickProp<IField<Data>, "inputType">;
  inputAutocomplete?: PickProp<IField<Data>, "inputAutocomplete">;
  description?: PickProp<IField<Data>, "description">;
  outlined?: PickProp<IField<Data>, "outlined">;
  title?: PickProp<IField<Data>, "title">;
  leadingIcon?: PickProp<IField<Data>, "leadingIcon">;
  trailingIcon?: PickProp<IField<Data>, "trailingIcon">;
  leadingIconClick?: PickProp<IField<Data>, "leadingIconClick">;
  trailingIconClick?: PickProp<IField<Data>, "trailingIconClick">;
  inputRows?: PickProp<IField<Data>, "inputRows">;
  placeholder?: PickProp<IField<Data>, "placeholder">;
}

interface ITextFieldPrivate<Data = IAnything> {
  onChange: PickProp<IManaged<Data>, "onChange">;
  invalid: PickProp<IManaged<Data>, "invalid">;
  value: PickProp<IManaged<Data>, "value">;
  disabled: PickProp<IManaged<Data>, "disabled">;
  dirty: PickProp<IManaged<Data>, "dirty">;
  name?: string;
}

export const TextField = ({
  invalid,
  value,
  disabled,
  inputType = "text",
  description = "",
  outlined = true,
  title = "",
  leadingIcon: li,
  trailingIcon: ti,
  leadingIconClick: lic,
  trailingIconClick: tic,
  inputRows: rows = 1,
  placeholder = "",
  inputAutocomplete: autoComplete,
  dirty,
  onChange,
  name,
}: ITextFieldProps & ITextFieldPrivate) => (
  <MatTextField
    name={name}
    variant={outlined ? "outlined" : "standard"}
    helperText={(dirty && invalid) || description}
    error={dirty && invalid !== null}
    InputProps={icons(li, ti, lic, tic, (value || '').toString(), onChange)}
    type={inputType}
    autoComplete={autoComplete}
    value={(value || '').toString()}
    placeholder={placeholder}
    onChange={({ target }) => onChange(target.value.toString())}
    label={title}
    disabled={disabled}
    {...multiline(rows)}
  />
);

TextField.displayName = 'TextField';

export default makeField(TextField, {
  watchAutocomplete: true,
});
