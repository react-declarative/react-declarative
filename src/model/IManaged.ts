import IField from './IField';
import IEntity from './IEntity';
import IAnything from './IAnything';

export type PickProp<T extends {}, P extends keyof T> = T[P];

export type DeepPartial<T> = {
    [P in keyof T]?: DeepPartial<T[P]>;
};

/**
 * Represents a layout with various properties that control its visibility, disabled state, and other features.
 *
 * @template Data - The data type used by the layout.
 * @template Payload - The payload type used by the layout.
 */
export interface IWrappedLayout<Data = IAnything, Payload = IAnything> {
    isVisible?: PickProp<IField<Data, Payload>, 'isVisible'>;
    isDisabled?: PickProp<IField<Data, Payload>, 'isDisabled'>;
    isReadonly?: PickProp<IField<Data, Payload>, 'isReadonly'>;
    features?: PickProp<IField<Data, Payload>, 'features'>;
    disabled?: PickProp<IField<Data, Payload>, 'disabled'>;
    phoneHidden?: PickProp<IField<Data, Payload>, 'phoneHidden'>;
    tabletHidden?: PickProp<IField<Data, Payload>, 'tabletHidden'>;
    desktopHidden?: PickProp<IField<Data, Payload>, 'desktopHidden'>;
    hidden?: PickProp<IField<Data, Payload>, 'hidden'>;
    noBaseline?: PickProp<IField<Data, Payload>, 'noBaseline'>;
}

/**
 * Типизацию компоновки следует вынести отдельно
 */
export interface IManagedLayout<Data = IAnything, Payload = IAnything> extends IWrappedLayout<Data, Payload> {
    columnsOverride?: PickProp<IField<Data, Payload>, 'columnsOverride'>;
    sx?: PickProp<IField<Data, Payload>, 'sx'>;
    columns?: PickProp<IField<Data, Payload>, 'columns'>;
    phoneColumns?: PickProp<IField<Data, Payload>, 'phoneColumns'>;
    tabletColumns?: PickProp<IField<Data, Payload>, 'tabletColumns'>;
    desktopColumns?: PickProp<IField<Data, Payload>, 'desktopColumns'>;
    fieldRightMargin?: PickProp<IField<Data, Payload>, 'fieldRightMargin'>;
    fieldBottomMargin?: PickProp<IField<Data, Payload>, 'fieldBottomMargin'>;
    features?: PickProp<IField<Data, Payload>, 'features'>;
}

/**
 * Компонент высшего порядка makeField
 * перехватывает управление над свойствами
 * поля
 */
export interface IManagedShallow<Data = IAnything, Payload = IAnything> extends IManagedLayout<Data> {
    isDisabled?: PickProp<IField<Data, Payload>, 'isDisabled'>;
    isVisible?: PickProp<IField<Data, Payload>, 'isVisible'>;
    isReadonly?: PickProp<IField<Data, Payload>, 'isReadonly'>;
    isInvalid?: PickProp<IField<Data, Payload>, 'isInvalid'>;
    isIncorrect?: PickProp<IField<Data, Payload>, 'isIncorrect'>;
    invalidity?: PickProp<IField<Data, Payload>, 'invalidity'>;
    shouldRecompute?: PickProp<IField<Data, Payload>, 'shouldRecompute'>;
    shouldUpdateItemList?: PickProp<IField<Data, Payload>, 'shouldUpdateItemList'>;
    shouldUpdateTr?: PickProp<IField<Data, Payload>, 'shouldUpdateTr'>;
    debug?: PickProp<IField<Data, Payload>, 'debug'>;
    compute?: PickProp<IField<Data, Payload>, 'compute'>;
    click?: PickProp<IField<Data, Payload>, 'click'>;
    focus?: PickProp<IField<Data, Payload>, 'focus'>;
    blur?: PickProp<IField<Data, Payload>, 'blur'>;
    menuItems?: PickProp<IField<Data, Payload>, 'menuItems'>;
    menu?: PickProp<IField<Data, Payload>, 'menu'>;
    map?: PickProp<IField<Data, Payload>, 'map'>;
    defaultValue?: PickProp<IField<Data, Payload>, 'defaultValue'>;
    hidden?: PickProp<IField<Data, Payload>, 'hidden'>;
    features?: PickProp<IField<Data, Payload>, 'features'>;
}

/**
 * Свойства, не доступные управляемому полю
 */
type Exclude<Data = IAnything> = {
    object: never;
    type: never;
    focus: never;
    blur: never;
    click: never;
    ready: never;
    check: never;
    change: never;
    name: never;
    menu: never;
    menuItems: never;
} & IManagedShallow<Data>;

/**
 * Свойства сущности, обернутой в компонент высшего порядка
 * Предоставляется удобная абстракция
 */
export interface IManaged<Data = IAnything, Value = any> extends Omit<IEntity<Data>, keyof Exclude<Data>> {
    name: string;
    value: Value;
    dirty: boolean;
    withContextMenu: true | undefined;
    disabled: boolean;
    loading: boolean;
    readonly: boolean;
    incorrect: string | null;
    invalid: string | null;
    object: Data;
    onChange: (v: Value, config?: {
        skipReadonly?: boolean;
    }) => void;
}

export default IManaged;
