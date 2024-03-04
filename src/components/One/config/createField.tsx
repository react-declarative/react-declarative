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
import TreeField from "../fields/TreeField";
import CompleteField from "../fields/CompleteField";
import InitField from "../fields/InitField";
import YesNoField from "../fields/YesNoField";
import DictField from "../fields/DictField";

const fieldMap: { [key in FieldType]?: React.ComponentType<IEntity> } = Object.create(null);

Object.assign(fieldMap, {
  [FieldType.Component]: ComponentField,
  [FieldType.Text]: TextField,
  [FieldType.Line]: LineField,
  [FieldType.Radio]: RadioField,
  [FieldType.Switch]: SwitchField,
  [FieldType.Checkbox]: CheckboxField,
  [FieldType.Progress]: ProgressField,
  [FieldType.Slider]: SliderField,
  [FieldType.Combo]: ComboField,
  [FieldType.Items]: ItemsField,
  [FieldType.Rating]: RatingField,
  [FieldType.Typography]: TypographyField,
  [FieldType.Date]: DateField,
  [FieldType.Time]: TimeField,
  [FieldType.File]: FileField,
  [FieldType.Choose]: ChooseField,
  [FieldType.Complete]: CompleteField,
  [FieldType.YesNo]: YesNoField,
  [FieldType.Init]: InitField,
  [FieldType.Dict]: DictField,
  [FieldType.Tree]: TreeField,
});

/**
 * Фабрика для создания полей
 */
export const createField = <Data extends IAnything = IAnything>(
  entity: IEntity<Data>,
  currentPath = ""
) => {
  const { type } = entity;
  let Field: React.ComponentType<IEntity<Data>> | undefined;
  if ((Field = fieldMap[type])) {
    return <Field {...entity} key={currentPath} />;
  } else {
    throw new Error("FieldFactory unknown key type");
  }
};

export default createField;
