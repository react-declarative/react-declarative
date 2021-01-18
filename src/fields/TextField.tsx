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

export interface ITextFieldProps {
  inputType: PickProp<IField, "inputType">;
  description: PickProp<IField, "description">;
  outlined: PickProp<IField, "outlined">;
  title: PickProp<IField, "title">;
  leadingIcon?: PickProp<IField, "leadingIcon">;
  trailingIcon?: PickProp<IField, "trailingIcon">;
  leadingIconClick?: PickProp<IField, "leadingIconClick">;
  trailingIconClick?: PickProp<IField, "trailingIconClick">;
  inputRows: PickProp<IField, "inputRows">;
  placeholder: PickProp<IField, "placeholder">;
}

interface ITextFieldPrivate {
  onChange: PickProp<IManaged, "onChange">;
  invalid: PickProp<IManaged, "invalid">;
  value: PickProp<IManaged, "value">;
  disabled: PickProp<IManaged, "disabled">;
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
  onChange,
}: ITextFieldProps & ITextFieldPrivate) => (
  <MatTextField
    variant={outlined ? "outlined" : "standard"}
    helperText={invalid || description}
    InputProps={icons(li, ti, lic, tic, (value || '').toString(), onChange)}
    type={inputType}
    value={value}
    error={invalid !== null}
    placeholder={placeholder}
    onChange={({ target }) => onChange(target.value.toString())}
    label={title}
    disabled={disabled}
    {...multiline(rows)}
  />
);

export default makeField(TextField);
