import IManaged, { IManagedShallow } from './IManaged';
import IEntity from './IEntity';
import FieldType from './FieldType';
import IAnything from './IAnything';

/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Компоновки
 */
import { IFragmentLayoutProps } from '../components/One/layouts/FragmentLayout';
import { IDivLayoutProps } from '../components/One/layouts/DivLayout';
import { ITabsLayoutProps } from '../components/One/layouts/TabsLayout';
import { ICenterLayoutProps } from '../components/One/layouts/CenterLayout';
import { IStretchLayoutProps } from '../components/One/layouts/StretchLayout';
import { IGroupLayoutProps } from '../components/One/layouts/GroupLayout';
import { IOutlineLayoutProps } from '../components/One/layouts/OutlineLayout';
import { IPaperLayoutProps } from '../components/One/layouts/PaperLayout';
import { IExpansionLayoutProps } from '../components/One/layouts/ExpansionLayout';
import { IHeroLayoutProps } from '../components/One/layouts/HeroLayout';
import { IConditionLayoutProps } from '../components/One/layouts/ConditionLayout';

/**
 * Поля ввода
 */
import { ICheckboxFieldProps } from '../components/One/fields/CheckboxField';
import { IComboFieldProps } from '../components/One/fields/ComboField';
import { IComponentFieldProps } from '../components/One/fields/ComponentField';
import { IItemsFieldProps } from '../components/One/fields/ItemsField';
import { ILineFieldProps } from '../components/One/fields/LineField';
import { IProgressFieldProps } from '../components/One/fields/ProgressField';
import { IRadioFieldProps } from '../components/One/fields/RadioField';
import { IRatingFieldProps } from '../components/One/fields/RatingField';
import { ISliderFieldProps } from '../components/One/fields/SliderField';
import { ISwitchFieldProps } from '../components/One/fields/SwitchField';
import { ITextFieldProps } from '../components/One/fields/TextField';
import { ITypographyFieldProps } from '../components/One/fields/TypographyField';

type Exclude<Data = IAnything> = Omit<IManaged<Data>, keyof IEntity<Data>>;

type TypedFieldFactory<Type extends FieldType, Fields extends {}, Data = IAnything> = {
  [Prop in keyof Omit<Fields, keyof Exclude<Data>>]?: Fields[Prop];
} & {
  type: Type;
};

type TypedFieldFactoryShallow<
  Type extends FieldType,
  Fields extends {},
  Data = IAnything,
> = IManagedShallow<Data> & TypedFieldFactory<Type, Fields, Data>;

type Group<Data = IAnything> = TypedFieldFactory<FieldType.Group, IGroupLayoutProps<Data>, Data>;
type Paper<Data = IAnything> = TypedFieldFactory<FieldType.Paper, IPaperLayoutProps<Data>, Data>;
type Outline<Data = IAnything> = TypedFieldFactory<FieldType.Outline, IOutlineLayoutProps<Data>, Data>;
type Expansion<Data = IAnything> = TypedFieldFactory<FieldType.Expansion, IExpansionLayoutProps<Data>, Data>;
type Fragment<Data = IAnything>  = TypedFieldFactory<FieldType.Fragment, IFragmentLayoutProps<Data>, Data>;
type Div<Data = IAnything> = TypedFieldFactory<FieldType.Div, IDivLayoutProps<Data>, Data>;
type Tabs<Data = IAnything> = TypedFieldFactory<FieldType.Tabs, ITabsLayoutProps<Data>, Data>;
type Hero<Data = IAnything> = TypedFieldFactory<FieldType.Hero, IHeroLayoutProps<Data>, Data>;
type Center<Data = IAnything> = TypedFieldFactory<FieldType.Center, ICenterLayoutProps<Data>, Data>;
type Stretch<Data = IAnything> = TypedFieldFactory<FieldType.Stretch, IStretchLayoutProps<Data>, Data>;
type Condition<Data = IAnything> = TypedFieldFactory<FieldType.Condition, IConditionLayoutProps<Data>, Data>;

type Line<Data = IAnything> = TypedFieldFactory<FieldType.Line, ILineFieldProps<Data>, Data>;

type Checkbox<Data = IAnything> = TypedFieldFactoryShallow<FieldType.Checkbox, ICheckboxFieldProps<Data>, Data>;
type Combo<Data = IAnything> = TypedFieldFactoryShallow<FieldType.Combo, IComboFieldProps<Data>, Data>;
type Component<Data = IAnything> = TypedFieldFactoryShallow<FieldType.Component, IComponentFieldProps<Data>, Data>;
type Items<Data = IAnything> = TypedFieldFactoryShallow<FieldType.Items, IItemsFieldProps<Data>, Data>;
type Progress<Data = IAnything> = TypedFieldFactoryShallow<FieldType.Progress, IProgressFieldProps<Data>, Data>;
type Radio<Data = IAnything> = TypedFieldFactoryShallow<FieldType.Radio, IRadioFieldProps<Data>, Data>;
type Rating<Data = IAnything> = TypedFieldFactoryShallow<FieldType.Rating, IRatingFieldProps<Data>, Data>;
type Slider<Data = IAnything> = TypedFieldFactoryShallow<FieldType.Slider, ISliderFieldProps<Data>, Data>;
type Switch<Data = IAnything> = TypedFieldFactoryShallow<FieldType.Switch, ISwitchFieldProps<Data>, Data>;
type Text<Data = IAnything> = TypedFieldFactoryShallow<FieldType.Text, ITextFieldProps<Data>, Data>;
type Typography<Data = IAnything> = TypedFieldFactoryShallow<FieldType.Typography, ITypographyFieldProps<Data>, Data>;

/**
 * Логическое ветвление компонентов
 * Typescript type-guard
 */
export type TypedFieldRegistry<Data = IAnything, Target = any> =
  Target extends Expansion<Data> ? Expansion<Data>
  : Target extends Group<Data> ? Group<Data>
  : Target extends Paper<Data> ? Paper<Data>
  : Target extends Outline<Data> ? Outline<Data>
  : Target extends Checkbox<Data> ? Checkbox<Data>
  : Target extends Combo<Data> ? Combo<Data>
  : Target extends Component<Data> ? Component<Data>
  : Target extends Items<Data> ? Items<Data>
  : Target extends Line<Data> ? Line<Data>
  : Target extends Progress<Data> ? Progress<Data>
  : Target extends Radio<Data> ? Radio<Data>
  : Target extends Rating<Data> ? Rating<Data>
  : Target extends Slider<Data> ? Slider<Data>
  : Target extends Switch<Data> ? Switch<Data>
  : Target extends Text<Data> ? Text<Data>
  : Target extends Typography<Data> ? Typography<Data>
  : Target extends Fragment<Data> ? Fragment<Data>
  : Target extends Div<Data> ? Div<Data>
  : Target extends Tabs<Data> ? Tabs<Data>
  : Target extends Center<Data> ? Center<Data>
  : Target extends Stretch<Data> ? Stretch<Data>
  : Target extends Hero<Data> ? Hero<Data>
  : Target extends Condition<Data> ? Condition<Data>
  : never;

/**
 * IOneProps - генерик, для прикладного программиста мы можем подменить IField
 * на TypedField.  Это  позволит  автоматически  выбрать  интерфейс  props для
 * IntelliSense после указания *type* или методом исключения
 */
export type TypedField<Data = IAnything> = TypedFieldRegistry<Data> & {
  name?: string;
  fields?: TypedField<Data>[];
  child?: TypedField<Data>;
};

export default TypedField;
