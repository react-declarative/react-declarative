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

type Exclude<Data = IAnything, Payload = IAnything> = Omit<IManaged<Data, Payload>, keyof IEntity<Data, Payload>>;

type TypedFieldFactory<Type extends FieldType, Fields extends {}, Data = IAnything, Payload = IAnything> = {
  [Prop in keyof Omit<Fields, keyof Exclude<Data, Payload>>]?: Fields[Prop];
} & {
  type: Type;
};

type TypedFieldFactoryShallow<
  Type extends FieldType,
  Fields extends {},
  Data = IAnything,
  Payload = IAnything,
> = IManagedShallow<Data, Payload> & TypedFieldFactory<Type, Fields, Data, Payload>;

type Group<Data = IAnything, Payload = IAnything> = TypedFieldFactory<FieldType.Group, IGroupLayoutProps<Data, Payload>, Data, Payload>;
type Paper<Data = IAnything, Payload = IAnything> = TypedFieldFactory<FieldType.Paper, IPaperLayoutProps<Data, Payload>, Data, Payload>;
type Outline<Data = IAnything, Payload = IAnything> = TypedFieldFactory<FieldType.Outline, IOutlineLayoutProps<Data, Payload>, Data, Payload>;
type Expansion<Data = IAnything, Payload = IAnything> = TypedFieldFactory<FieldType.Expansion, IExpansionLayoutProps<Data, Payload>, Data, Payload>;
type Fragment<Data = IAnything, Payload = IAnything>  = TypedFieldFactory<FieldType.Fragment, IFragmentLayoutProps<Data, Payload>, Data, Payload>;
type Div<Data = IAnything, Payload = IAnything> = TypedFieldFactory<FieldType.Div, IDivLayoutProps<Data, Payload>, Data, Payload>;
type Tabs<Data = IAnything, Payload = IAnything> = TypedFieldFactory<FieldType.Tabs, ITabsLayoutProps<Data, Payload>, Data, Payload>;
type Hero<Data = IAnything, Payload = IAnything> = TypedFieldFactory<FieldType.Hero, IHeroLayoutProps<Data, Payload>, Data, Payload>;
type Center<Data = IAnything, Payload = IAnything> = TypedFieldFactory<FieldType.Center, ICenterLayoutProps<Data, Payload>, Data, Payload>;
type Stretch<Data = IAnything, Payload = IAnything> = TypedFieldFactory<FieldType.Stretch, IStretchLayoutProps<Data, Payload>, Data, Payload>;
type Condition<Data = IAnything, Payload = IAnything> = TypedFieldFactory<FieldType.Condition, IConditionLayoutProps<Data, Payload>, Data, Payload>;

type Line<Data = IAnything, Payload = IAnything> = TypedFieldFactory<FieldType.Line, ILineFieldProps<Data, Payload>, Data, Payload>;

type Checkbox<Data = IAnything, Payload = IAnything> = TypedFieldFactoryShallow<FieldType.Checkbox, ICheckboxFieldProps<Data, Payload>, Data, Payload>;
type Combo<Data = IAnything, Payload = IAnything> = TypedFieldFactoryShallow<FieldType.Combo, IComboFieldProps<Data, Payload>, Data, Payload>;
type Component<Data = IAnything, Payload = IAnything> = TypedFieldFactoryShallow<FieldType.Component, IComponentFieldProps<Data, Payload>, Data, Payload>;
type Items<Data = IAnything, Payload = IAnything> = TypedFieldFactoryShallow<FieldType.Items, IItemsFieldProps<Data, Payload>, Data, Payload>;
type Progress<Data = IAnything, Payload = IAnything> = TypedFieldFactoryShallow<FieldType.Progress, IProgressFieldProps<Data, Payload>, Data, Payload>;
type Radio<Data = IAnything, Payload = IAnything> = TypedFieldFactoryShallow<FieldType.Radio, IRadioFieldProps<Data, Payload>, Data, Payload>;
type Rating<Data = IAnything, Payload = IAnything> = TypedFieldFactoryShallow<FieldType.Rating, IRatingFieldProps<Data, Payload>, Data, Payload>;
type Slider<Data = IAnything, Payload = IAnything> = TypedFieldFactoryShallow<FieldType.Slider, ISliderFieldProps<Data, Payload>, Data, Payload>;
type Switch<Data = IAnything, Payload = IAnything> = TypedFieldFactoryShallow<FieldType.Switch, ISwitchFieldProps<Data, Payload>, Data, Payload>;
type Text<Data = IAnything, Payload = IAnything> = TypedFieldFactoryShallow<FieldType.Text, ITextFieldProps<Data, Payload>, Data, Payload>;
type Typography<Data = IAnything, Payload = IAnything> = TypedFieldFactoryShallow<FieldType.Typography, ITypographyFieldProps<Data, Payload>, Data, Payload>;

/**
 * Логическое ветвление компонентов
 * Typescript type-guard
 */
export type TypedFieldRegistry<Data = IAnything, Payload = IAnything, Target = any> =
  Target extends Expansion<Data, Payload> ? Expansion<Data, Payload>
  : Target extends Group<Data, Payload> ? Group<Data, Payload>
  : Target extends Paper<Data, Payload> ? Paper<Data, Payload>
  : Target extends Outline<Data, Payload> ? Outline<Data, Payload>
  : Target extends Checkbox<Data, Payload> ? Checkbox<Data, Payload>
  : Target extends Combo<Data, Payload> ? Combo<Data, Payload>
  : Target extends Component<Data, Payload> ? Component<Data, Payload>
  : Target extends Items<Data, Payload> ? Items<Data, Payload>
  : Target extends Line<Data, Payload> ? Line<Data, Payload>
  : Target extends Progress<Data, Payload> ? Progress<Data, Payload>
  : Target extends Radio<Data, Payload> ? Radio<Data, Payload>
  : Target extends Rating<Data, Payload> ? Rating<Data, Payload>
  : Target extends Slider<Data, Payload> ? Slider<Data, Payload>
  : Target extends Switch<Data, Payload> ? Switch<Data, Payload>
  : Target extends Text<Data, Payload> ? Text<Data, Payload>
  : Target extends Typography<Data, Payload> ? Typography<Data, Payload>
  : Target extends Fragment<Data, Payload> ? Fragment<Data, Payload>
  : Target extends Div<Data, Payload> ? Div<Data, Payload>
  : Target extends Tabs<Data, Payload> ? Tabs<Data, Payload>
  : Target extends Center<Data, Payload> ? Center<Data, Payload>
  : Target extends Stretch<Data, Payload> ? Stretch<Data, Payload>
  : Target extends Hero<Data, Payload> ? Hero<Data, Payload>
  : Target extends Condition<Data, Payload> ? Condition<Data, Payload>
  : never;

/**
 * IOneProps - генерик, для прикладного программиста мы можем подменить IField
 * на TypedField.  Это  позволит  автоматически  выбрать  интерфейс  props для
 * IntelliSense после указания *type* или методом исключения
 */
export type TypedField<Data = IAnything, Payload = IAnything> = TypedFieldRegistry<Data, Payload> & {
  name?: string;
  fields?: TypedField<Data, Payload>[];
  child?: TypedField<Data, Payload>;
};

export default TypedField;
