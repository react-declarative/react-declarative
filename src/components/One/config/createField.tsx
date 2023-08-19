import * as React from "react";

/* eslint-disable react/jsx-max-props-per-line */

import FieldType from "../../../model/FieldType";
import IAnything from "../../../model/IAnything";
import IEntity from "../../../model/IEntity";

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
import DateField from "../fields/DateField";
import TimeField from "../fields/TimeField";
import FileField from "../fields/FileField";
import ChooseField from "../fields/ChooseField";
import CompleteField from "../fields/CompleteField";
import InitField from "../fields/InitField";

const Fragment = () => <></>;

const fieldMap = new Map<FieldType, React.ComponentType<IEntity>>([
  [FieldType.Component, ComponentField],
  [FieldType.Text, TextField],
  [FieldType.Line, LineField],
  [FieldType.Radio, RadioField],
  [FieldType.Switch, SwitchField],
  [FieldType.Checkbox, CheckboxField],
  [FieldType.Progress, ProgressField],
  [FieldType.Slider, SliderField],
  [FieldType.Combo, ComboField],
  [FieldType.Items, ItemsField],
  [FieldType.Rating, RatingField],
  [FieldType.Typography, TypographyField],
  [FieldType.Date, DateField],
  [FieldType.Time, TimeField],
  [FieldType.File, FileField],
  [FieldType.Choose, ChooseField],
  [FieldType.Complete, CompleteField],
  [FieldType.Init, InitField],
]);

export const createField = <Data extends IAnything = IAnything>(
  entity: IEntity<Data>,
  currentPath = ""
) => {
  const { type } = entity;
  let Field: React.ComponentType<IEntity<Data>> | undefined;
  if (entity.hidden) {
    return <Fragment />;
  } else if ((Field = fieldMap.get(type))) {
    return <Field {...entity} key={currentPath} />;
  } else {
    throw new Error("FieldFactory unknown key type");
  }
};

export default createField;
