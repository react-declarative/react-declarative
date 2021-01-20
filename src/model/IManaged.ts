import IField from './IField';
import IEntity from './IEntity';
import IAnything from './IAnything';

export type PickProp<T extends {}, P extends keyof T> = T[P];

/**
 * Возможные значения value
 */
type v = number | string | boolean | null | IAnything | IAnything[];

/**
 * Типизацию компоновки следует вынести отдельно
 */
export interface IManagedLayout {
    columns?: PickProp<IField, 'columns'>;
    phoneColumns?: PickProp<IField, 'phoneColumns'>;
    tabletColumns?: PickProp<IField, 'tabletColumns'>;
    desktopColumns?: PickProp<IField, 'desktopColumns'>;
    fieldRightMargin?: PickProp<IField, 'fieldRightMargin'>;
    fieldBottomMargin?: PickProp<IField, 'fieldBottomMargin'>;
}

/**
 * Компонент высшего порядка makeField
 * перехватывает управление над свойствами
 * поля
 */
export interface IManagedShallow extends IManagedLayout {
    isDisabled?: PickProp<IField, 'isDisabled'>;
    isVisible?: PickProp<IField, 'isVisible'>;
    isInvalid?: PickProp<IField, 'isInvalid'>;
    invalidity?: PickProp<IField, 'invalidity'>;
    compute?: PickProp<IField, 'compute'>;
    focus?: PickProp<IField, 'focus'>;
    blur?: PickProp<IField, 'blur'>;
    defaultValue?: v;
}

/**
 * Свойства, не доступные управляемому полю
 */
type Exclude = {
    object: never;
    type: never;
    focus: never;
    blur: never;
    ready: never;
    check: never;
    change: never;
    name: never;
} & IManagedShallow;

/**
 * Свойства сущности, обернутой в компонент высшего порядка
 * Предоставляется удобная абстракция
 */
export interface IManaged extends Omit<IEntity, keyof Exclude> {
    value: v;
    dirty: boolean;
    disabled: boolean;
    invalid: string | null;
    onChange: (v: v, skipReadonly?: boolean) => void;
}

export default IManaged;
