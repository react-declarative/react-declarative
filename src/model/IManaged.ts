import IField from './IField';
import IEntity from './IEntity';
import IAnything from './IAnything';

export type PickProp<T extends {}, P extends keyof T> = T[P];

export type DeepPartial<T> = {
    [P in keyof T]?: DeepPartial<T[P]>;
};

/**
 * Типизацию компоновки следует вынести отдельно
 */
export interface IManagedLayout<Data = IAnything> {
    columnsOverride?: PickProp<IField<Data>, 'columnsOverride'>;
    columns?: PickProp<IField<Data>, 'columns'>;
    roles?: PickProp<IField<Data>, 'roles'>;
    phoneColumns?: PickProp<IField<Data>, 'phoneColumns'>;
    tabletColumns?: PickProp<IField<Data>, 'tabletColumns'>;
    desktopColumns?: PickProp<IField<Data>, 'desktopColumns'>;
    fieldRightMargin?: PickProp<IField<Data>, 'fieldRightMargin'>;
    fieldBottomMargin?: PickProp<IField<Data>, 'fieldBottomMargin'>;
}

/**
 * Компонент высшего порядка makeField
 * перехватывает управление над свойствами
 * поля
 */
export interface IManagedShallow<Data = IAnything> extends IManagedLayout<Data> {
    isDisabled?: PickProp<IField<Data>, 'isDisabled'>;
    isVisible?: PickProp<IField<Data>, 'isVisible'>;
    isInvalid?: PickProp<IField<Data>, 'isInvalid'>;
    invalidity?: PickProp<IField<Data>, 'invalidity'>;
    compute?: PickProp<IField<Data>, 'compute'>;
    focus?: PickProp<IField<Data>, 'focus'>;
    blur?: PickProp<IField<Data>, 'blur'>;
    defaultValue?: PickProp<IField<Data>, 'defaultValue'>;
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
