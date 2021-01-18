import IManaged, { IManagedShallow } from './IManaged';
import IEntity from './IEntity';
import FieldType from './FieldType';

/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Компоновки
 */
import { IFragmentLayoutProps } from '../layouts/FragmentLayout';
import { IDivLayoutProps } from '../layouts/DivLayout';
import { IGroupLayoutProps } from '../layouts/GroupLayout';
import { IPaperLayoutProps } from '../layouts/PaperLayout';
import { IExpansionLayoutProps } from '../layouts/ExpansionLayout';

/**
 * Поля ввода
 */
import { ICheckboxFieldProps } from '../fields/CheckboxField';
import { IComboFieldProps } from '../fields/ComboField';
import { IComponentFieldProps } from '../fields/ComponentField';
import { IItemsFieldProps } from '../fields/ItemsField';
import { ILineFieldProps } from '../fields/LineField';
import { IProgressFieldProps } from '../fields/ProgressField';
import { IRadioFieldProps } from '../fields/RadioField';
import { IRatingFieldProps } from '../fields/RatingField';
import { ISliderFieldProps } from '../fields/SliderField';
import { ISwitchFieldProps } from '../fields/SwitchField';
import { ITextFieldProps } from '../fields/TextField';
import { ITypographyFieldProps } from '../fields/TypographyField';

type Exclude = Omit<IManaged, keyof IEntity>;

type TypedFieldFactory<T extends FieldType, F extends {}> = {
  [P in keyof Omit<F, keyof Exclude>]?: F[P];
} & {
  type: T;
};

type TypedFieldFactoryShallow<
  T extends FieldType,
  F extends {}
> = IManagedShallow & TypedFieldFactory<T, F>;

type Group = TypedFieldFactory<FieldType.Group, IGroupLayoutProps>;
type Paper = TypedFieldFactory<FieldType.Paper, IPaperLayoutProps>;
type Expansion = TypedFieldFactory<FieldType.Expansion, IExpansionLayoutProps>;
type Fragment = TypedFieldFactory<FieldType.Fragment, IFragmentLayoutProps>;
type Div = TypedFieldFactory<FieldType.Div, IDivLayoutProps>;

type Line = TypedFieldFactory<FieldType.Line, ILineFieldProps>;

type Checkbox = TypedFieldFactoryShallow<FieldType.Checkbox, ICheckboxFieldProps>;
type Combo = TypedFieldFactoryShallow<FieldType.Combo, IComboFieldProps>;
type Component = TypedFieldFactoryShallow<FieldType.Component, IComponentFieldProps>;
type Items = TypedFieldFactoryShallow<FieldType.Items, IItemsFieldProps>;
type Progress = TypedFieldFactoryShallow<FieldType.Progress, IProgressFieldProps>;
type Radio = TypedFieldFactoryShallow<FieldType.Radio, IRadioFieldProps>;
type Rating = TypedFieldFactoryShallow<FieldType.Rating, IRatingFieldProps>;
type Slider = TypedFieldFactoryShallow<FieldType.Slider, ISliderFieldProps>;
type Switch = TypedFieldFactoryShallow<FieldType.Switch, ISwitchFieldProps>;
type Text = TypedFieldFactoryShallow<FieldType.Text, ITextFieldProps>;
type Typography = TypedFieldFactoryShallow<FieldType.Typography, ITypographyFieldProps>;

/**
 * Логическое ветвление компонентов
 * Typescript type-guard
 */
export type TypedFieldRegistry<T = any> =
  T extends Expansion ? Expansion
  : T extends Group ? Group
  : T extends Paper ? Paper
  : T extends Checkbox ? Checkbox
  : T extends Combo ? Combo
  : T extends Component ? Component
  : T extends Items ? Items
  : T extends Line ? Line
  : T extends Progress ? Progress
  : T extends Radio ? Radio
  : T extends Rating ? Rating
  : T extends Slider ? Slider
  : T extends Switch ? Switch
  : T extends Text ? Text
  : T extends Typography ? Typography
  : T extends Fragment ? Fragment
  : T extends Div ? Div
  : never;

/**
 * IOneProps - генерик, для прикладного программиста мы можем подменить IField
 * на TypedField.  Это  позволит  автоматически  выбрать  интерфейс  props для
 * IntelliSense после указания *type* или методом исключения
 */
export type TypedField = TypedFieldRegistry & {
  name?: string;
  fields?: TypedField[];
};

export default TypedField;
