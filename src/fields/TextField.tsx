import * as React from "react";

import Text from '../slots/TextSlot';

import makeField from "../components/makeField";

import IManaged, { PickProp } from "../model/IManaged";
import IAnything from "../model/IAnything";
import IField from "../model/IField";

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
  readonly?: PickProp<IField<Data>, "readonly">;
}

export interface ITextFieldPrivate<Data = IAnything> {
  onChange: PickProp<IManaged<Data>, "onChange">;
  invalid: PickProp<IManaged<Data>, "invalid">;
  value: PickProp<IManaged<Data>, "value">;
  disabled: PickProp<IManaged<Data>, "disabled">;
  dirty: PickProp<IManaged<Data>, "dirty">;
  name: PickProp<IManaged<Data>, "name">;
}

export const TextField = ({
  invalid,
  value,
  disabled,
  inputType = "text",
  description = "",
  outlined = true,
  title = "",
  leadingIcon,
  trailingIcon,
  leadingIconClick,
  trailingIconClick,
  inputRows = 1,
  placeholder = "",
  inputAutocomplete = "off",
  dirty,
  onChange,
  name,
}: ITextFieldProps & ITextFieldPrivate) => (
  <Text
    invalid={invalid}
    value={value}
    disabled={disabled}
    inputType={inputType}
    description={description}
    outlined={outlined}
    title={title}
    leadingIcon={leadingIcon}
    trailingIcon={trailingIcon}
    leadingIconClick={leadingIconClick}
    trailingIconClick={trailingIconClick}
    inputRows={inputRows}
    placeholder={placeholder}
    inputAutocomplete={inputAutocomplete}
    dirty={dirty}
    onChange={onChange}
    name={name}
  />
);

TextField.displayName = 'TextField';

export default makeField(TextField);
