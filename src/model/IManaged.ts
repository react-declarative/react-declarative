import IField from './IField';
import IEntity from './IEntity';
import IAnything from './IAnything';

export type PickProp<T extends {}, P extends keyof T> = T[P];

export type DeepPartial<T> = {
    [P in keyof T]?: DeepPartial<T[P]>;
};

export interface IWrappedLayout<Data = IAnything, Payload = IAnything> {
    isVisible?: PickProp<IField<Data, Payload>, 'isVisible'>;
    isDisabled?: PickProp<IField<Data, Payload>, 'isDisabled'>;
    isReadonly?: PickProp<IField<Data, Payload>, 'isReadonly'>;
}

/**
 * Типизацию компоновки следует вынести отдельно
 */
export interface IManagedLayout<Data = IAnything, Payload = IAnything> extends IWrappedLayout<Data, Payload> {
    columnsOverride?: PickProp<IField<Data, Payload>, 'columnsOverride'>;
    sx?: PickProp<IField<Data, Payload>, 'sx'>;
    columns?: PickProp<IField<Data, Payload>, 'columns'>;
    roles?: PickProp<IField<Data, Payload>, 'roles'>;
    phoneColumns?: PickProp<IField<Data, Payload>, 'phoneColumns'>;
    tabletColumns?: PickProp<IField<Data, Payload>, 'tabletColumns'>;
    desktopColumns?: PickProp<IField<Data, Payload>, 'desktopColumns'>;
    fieldRightMargin?: PickProp<IField<Data, Payload>, 'fieldRightMargin'>;
    fieldBottomMargin?: PickProp<IField<Data, Payload>, 'fieldBottomMargin'>;
    disabled?: PickProp<IField<Data, Payload>, 'disabled'>;

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
    invalidity?: PickProp<IField<Data, Payload>, 'invalidity'>;
    compute?: PickProp<IField<Data, Payload>, 'compute'>;
    focus?: PickProp<IField<Data, Payload>, 'focus'>;
    blur?: PickProp<IField<Data, Payload>, 'blur'>;
    defaultValue?: PickProp<IField<Data, Payload>, 'defaultValue'>;
    hidden?: PickProp<IField<Data, Payload>, 'hidden'>;
}

/**
 * Свойства, не доступные управляемому полю
 */
type Exclude<Data = IAnything> = {
    object: never;
    type: never;
    focus: never;
    blur: never;
    ready: never;
    check: never;
    change: never;
    name: never;
} & IManagedShallow<Data>;

/**
 * Свойства сущности, обернутой в компонент высшего порядка
 * Предоставляется удобная абстракция
 */
export interface IManaged<Data = IAnything, Value = any> extends Omit<IEntity<Data>, keyof Exclude<Data>> {
    name: string;
    value: Value;
    dirty: boolean;
    disabled: boolean;
    loading: boolean;
    readonly: boolean;
    invalid: string | null;
    object: Data;
    onChange: (v: Value, config?: {
        skipReadonly?: boolean;
    }) => void;
}

export default IManaged;
