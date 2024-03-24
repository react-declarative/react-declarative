import * as React from "react";

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

/**
 * fieldMap represents a collection of field types and their corresponding field components.
 * Each field type is mapped to its corresponding field component.
 *
 * @typedef {Object.<FieldType, ComponentField>} FieldTypeToComponent
 * @property {ComponentField} [FieldType.Component] - The component for rendering a generic field.
 * @property {ComponentField} [FieldType.Text] - The component for rendering a text field.
 * @property {ComponentField} [FieldType.Line] - The component for rendering a line field.
 * @property {ComponentField} [FieldType.Radio] - The component for rendering a radio field.
 * @property {ComponentField} [FieldType.Switch] - The component for rendering a switch field.
 * @property {ComponentField} [FieldType.Checkbox] - The component for rendering a checkbox field.
 * @property {ComponentField} [FieldType.Progress] - The component for rendering a progress field.
 * @property {ComponentField} [FieldType.Slider] - The component for rendering a slider field.
 * @property {ComponentField} [FieldType.Combo] - The component for rendering a combo field.
 * @property {ComponentField} [FieldType.Items] - The component for rendering an items field.
 * @property {ComponentField} [FieldType.Rating] - The component for rendering a rating field.
 * @property {ComponentField} [FieldType.Typography] - The component for rendering a typography field.
 * @property {ComponentField} [FieldType.Date] - The component for rendering a date field.
 * @property {ComponentField} [FieldType.Time] - The component for rendering a time field.
 * @property {ComponentField} [FieldType.File] - The component for rendering a file field.
 * @property {ComponentField} [FieldType.Choose] - The component for rendering a choose field.
 * @property {ComponentField} [FieldType.Complete] - The component for rendering a complete field.
 * @property {ComponentField} [FieldType.YesNo] - The component for rendering a yes/no field.
 * @property {ComponentField} [FieldType.Init] - The component for rendering an init field.
 * @property {ComponentField} [FieldType.Dict] - The component for rendering a dictionary field.
 * @property {ComponentField} [FieldType.Tree] - The component for rendering a tree field.
 */
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
