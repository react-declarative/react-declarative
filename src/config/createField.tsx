import * as React from "react";

/* eslint-disable react/jsx-max-props-per-line */

import FieldType from "../model/FieldType";
import IEntity from "../model/IEntity";

import ComponentField from "../fields/ComponentField";
import TextField from "../fields/TextField";
import LineField from "../fields/LineField";
import RadioField from "../fields/RadioField";
import SwitchField from "../fields/SwitchField";
import CheckboxField from "../fields/CheckboxField";
import ProgressField from "../fields/ProgressField";
import SliderField from "../fields/SliderField";
import ComboField from "../fields/ComboField";
import ItemsField from "../fields/ItemsField";
import RatingField from "../fields/RatingField";
import TypographyField from "../fields/TypographyField";

export const createField = (entity: IEntity, currentPath = "") => {
  const { type } = entity;
  if (type === FieldType.Text) {
    return <TextField {...entity} key={currentPath} />;
  } else if (type === FieldType.Line) {
    return <LineField {...entity} key={currentPath} />;
  } else if (type === FieldType.Radio) {
    return <RadioField {...entity} key={currentPath} />;
  } else if (type === FieldType.Switch) {
    return <SwitchField {...entity} key={currentPath} />;
  } else if (type === FieldType.Checkbox) {
    return <CheckboxField {...entity} key={currentPath} />;
  } else if (type === FieldType.Progress) {
    return <ProgressField {...entity} key={currentPath} />;
  } else if (type === FieldType.Component) {
    return <ComponentField {...entity} key={currentPath} />;
  } else if (type === FieldType.Slider) {
    return <SliderField {...entity} key={currentPath} />;
  } else if (type === FieldType.Combo) {
    return <ComboField {...entity} key={currentPath} />;
  } else if (type === FieldType.Items) {
    return <ItemsField {...entity} key={currentPath} />;
  } else if (type === FieldType.Rating) {
    return <RatingField {...entity} key={currentPath} />;
  } else if (type === FieldType.Typography) {
    return <TypographyField {...entity} key={currentPath} />;
  } else {
    throw new Error("FieldFactory unknown key type");
  }
};

export default createField;
