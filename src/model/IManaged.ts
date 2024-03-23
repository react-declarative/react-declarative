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
    /**
     * Represents the `isVisible` property of a field in a form.
     *
     * @typedef {PickProp<IField<Data, Payload>, 'isVisible'>} isVisible
     * @property {boolean} isVisible - Indicates whether the field is visible or not.
     */
    isVisible?: PickProp<IField<Data, Payload>, 'isVisible'>;
    /**
     * Represents the `isDisabled` property of a field in a form.
     * The `isDisabled` property determines whether the field is disabled or not.
     *
     * @typedef {PickProp<IField<Data, Payload>, 'isDisabled'>} isDisabled
     * @property {boolean} [isDisabled] - Indicates whether the field is disabled.
     */
    isDisabled?: PickProp<IField<Data, Payload>, 'isDisabled'>;
    /**
     * Retrieves the value of the 'isReadonly' property from the given variable.
     *
     * @param {IField<Data, Payload>} variable - The variable to retrieve the property from.
     * @returns {PickProp<IField<Data, Payload>, 'isReadonly'>} The value of the 'isReadonly' property.
     */
    isReadonly?: PickProp<IField<Data, Payload>, 'isReadonly'>;
    /**
     * Retrieves the 'features' property from a given variable.
     *
     * @template T - The type of the variable.
     * @template K - The property name to retrieve.
     * @param {T} variable - The variable to extract the property from.
     * @returns {Pick<T, K>} - The extracted 'features' property.
     */
    features?: PickProp<IField<Data, Payload>, 'features'>;
    /**
     * Represents the `disabled` property of a field.
     *
     * @typedef {boolean} Disabled
     */
    disabled?: PickProp<IField<Data, Payload>, 'disabled'>;
    /**
     * Represents the `phoneHidden` property of a field object.
     *
     * @typedef {PickProp<IField<Data, Payload>, 'phoneHidden'>} phoneHidden
     * @property {boolean} phoneHidden - Specifies whether the phone field should be hidden.
     */
    phoneHidden?: PickProp<IField<Data, Payload>, 'phoneHidden'>;
    /**
     * Represents the optional property 'tabletHidden' in a field object.
     *
     * @typedef {PickProp<IField<Data, Payload>, 'tabletHidden'>} tabletHidden
     */
    tabletHidden?: PickProp<IField<Data, Payload>, 'tabletHidden'>;
    /**
     * Represents the optional property `desktopHidden` of type `PickProp<IField<Data, Payload>, 'desktopHidden'>`.
     *
     * @typedef {PickProp<IField<Data, Payload>, 'desktopHidden'>} desktopHidden
     */
    desktopHidden?: PickProp<IField<Data, Payload>, 'desktopHidden'>;
    /**
     * Represents the 'hidden' property of an object.
     *
     * @template IField - The type of the field object.
     * @template Data - The type of the data object.
     * @template Payload - The type of the payload object.
     *
     * @typedef {PickProp<IField<Data, Payload>, 'hidden'>} Hidden
     */
    hidden?: PickProp<IField<Data, Payload>, 'hidden'>;
    /**
     * Represents an optional property `noBaseline` that is picked from the interface `IField` using the `PickProp` utility type.
     *
     * @template Data - The type of data associated with the field.
     * @template Payload - The type of payload associated with the field.
     *
     * @typedef {PickProp<IField<Data, Payload>, 'noBaseline'>} noBaseline
     *
     * @property {boolean} [noBaseline] - Specifies whether the field has a baseline or not.
     */
    noBaseline?: PickProp<IField<Data, Payload>, 'noBaseline'>;
}

/**
 * Типизацию компоновки следует вынести отдельно
 */
export interface IManagedLayout<Data = IAnything, Payload = IAnything> extends IWrappedLayout<Data, Payload> {
    /**
     * Represents override columns configuration for a field.
     *
     * @typedef {PickProp<IField<Data, Payload>, 'columnsOverride'>} columnsOverride
     *
     * @property {string} - The name of the field for which the columns are overridden.
     */
    columnsOverride?: PickProp<IField<Data, Payload>, 'columnsOverride'>;
    /**
     * Represents the 'sx' property of the 'PickProp' type.
     *
     * @typedef {keyof IField<Data, Payload>} IFieldKey
     * @typedef PickProp<IField<Data, Payload>, 'sx'> SxProp
     *
     * @property {IFieldKey} sx - The key of the 'IField' type that represents the 'sx' property.
     */
    sx?: PickProp<IField<Data, Payload>, 'sx'>;
    /**
     * Retrieves the specific columns from a given object.
     */
    columns?: PickProp<IField<Data, Payload>, 'columns'>;
    /**
     * Represents the phone columns configuration for a field
     */
    phoneColumns?: PickProp<IField<Data, Payload>, 'phoneColumns'>;
    /**
     * Represents the number of columns for the "tablet" viewport size of a field.
     * This property is optional.
     *
     * @typedef {PickProp<IField<Data, Payload>, 'tabletColumns'>} tabletColumns
     */
    tabletColumns?: PickProp<IField<Data, Payload>, 'tabletColumns'>;
    /**
     * Represents the number of columns on a desktop layout for a field in a data payload object.
     *
     * @typedef {number} desktopColumns
     * @property {number} desktopColumns - The number of columns on a desktop layout.
     * @property {PickProp<IField<Data, Payload>, 'desktopColumns'>} desktopColumns - Optional property to pick the 'desktopColumns' property from 'IField<Data, Payload>' interface.
     */
    desktopColumns?: PickProp<IField<Data, Payload>, 'desktopColumns'>;
    /**
     * Represents the right margin of a field.
     *
     * @typedef {number} FieldRightMargin
     */
    fieldRightMargin?: PickProp<IField<Data, Payload>, 'fieldRightMargin'>;
    /**
     * Represents the optional configuration for the bottom margin
     * of a field.
     *
     * @typedef {number} FieldBottomMargin
     */
    fieldBottomMargin?: PickProp<IField<Data, Payload>, 'fieldBottomMargin'>;
    /**
     * Returns the picked 'features' property from the given variable.
     *
     * @template Data - The type of data.
     * @template Payload - The type of payload.
     * @template T - The type of the variable.
     * @param {T} variable - The variable from which to pick the 'features' property.
     * @returns {PickProp<IField<Data, Payload>, 'features'>} - The picked 'features' property.
     */
    features?: PickProp<IField<Data, Payload>, 'features'>;
}

/**
 * Компонент высшего порядка makeField
 * перехватывает управление над свойствами
 * поля
 */
export interface IManagedShallow<Data = IAnything, Payload = IAnything> extends IManagedLayout<Data> {
    /**
     * Represents the `isDisabled` property of a field object.
     *
     * @typedef {import("<path to PickProp>").PickProp} PickProp
     * @typedef {import("<path to IField>").IField} IField
     * @typedef {import("<path to Data>").Data} Data
     * @typedef {import("<path to Payload>").Payload} Payload
     *
     * @type {PickProp<IField<Data, Payload>, 'isDisabled'>}
     *
     * @description
     * The `isDisabled` property indicates whether a field is disabled or not.
     * If `isDisabled` is `true`, the field is disabled, meaning it cannot be interacted with.
     * If `isDisabled` is `false`, the field is enabled and can be interacted with.
     *
     */
    isDisabled?: PickProp<IField<Data, Payload>, 'isDisabled'>;
    /**
     * Determines the visibility of a field.
     *
     * @typedef {boolean} isVisible
     * @description The `isVisible` property is used to determine whether a field is visible or hidden.
     *
     * @param {IField<Data, Payload>} field - The field object that contains the `isVisible` property.
     *
     * @returns {boolean} - Returns `true` if the field is visible, `false` otherwise.
     */
    isVisible?: PickProp<IField<Data, Payload>, 'isVisible'>;
    /**
     * Determines if the field is readonly.
     *
     * @typedef {boolean} isReadonly
     */
    isReadonly?: PickProp<IField<Data, Payload>, 'isReadonly'>;
    /**
     * Represents the `isInvalid` field of a given field.
     *
     * @typedef {PickProp<IField<Data, Payload>, 'isInvalid'>} IsInvalid
     */
    isInvalid?: PickProp<IField<Data, Payload>, 'isInvalid'>;
    /**
     * Checks if the field is incorrect.
     *
     * @template T - The object type to check.
     * @template K - The propertyname to pick from the object type.
     * @param obj - The object to check.
     * @param prop - The property name to pick from the object type.
     * @returns - A boolean indicating whether the field is incorrect.
     */
    isIncorrect?: PickProp<IField<Data, Payload>, 'isIncorrect'>;
    invalidity?: PickProp<IField<Data, Payload>, 'invalidity'>;
    /**
     * Determines if the field should be recomputed.
     *
     * @typedef {PickProp<IField<Data, Payload>, 'shouldRecompute'>} shouldRecompute
     *
     * @property {boolean} shouldRecompute - Indicates whether the field should be recomputed.
     */
    shouldRecompute?: PickProp<IField<Data, Payload>, 'shouldRecompute'>;
    /**
     * Check if 'shouldUpdateItemList' property is present in the given variable.
     *
     * @typedef {PickProp<IField<Data, Payload>, 'shouldUpdateItemList'>} shouldUpdateItemList
     * @param {shouldUpdateItemList} shouldUpdateItemList - The variable to be checked.
     * @returns {boolean} - Returns true if 'shouldUpdateItemList' property is present, otherwise false.
     */
    shouldUpdateItemList?: PickProp<IField<Data, Payload>, 'shouldUpdateItemList'>;
    /**
     * Determines if the 'shouldUpdateTr' property should be updated.
     *
     * @typedef {PickProp<IField<Data, Payload>, 'shouldUpdateTr'>} shouldUpdateTr
     * @property {boolean} shouldUpdateTr.value - The current value of the 'shouldUpdateTr' property.
     * @property {boolean} shouldUpdateTr.isReady - Indicates if the 'shouldUpdateTr' property is ready for update.
     * @property {boolean} shouldUpdateTr.isEnabled - Determines if the 'shouldUpdateTr' property is enabled.
     */
    shouldUpdateTr?: PickProp<IField<Data, Payload>, 'shouldUpdateTr'>;
    /**
     * Represents the debug property of a field.
     * @template Data - The type of data associated with the field.
     * @template Payload - The type of payload associated with the field.
     * @typedef {PickProp<IField<Data, Payload>, 'debug'>} debug
     *
     * @property {boolean} value - The value of the debug property.
     * @property {PickProp<IField<Data, Payload>, 'debug'>} props - Additional properties of the field.
     */
    debug?: PickProp<IField<Data, Payload>, 'debug'>;
    /**
     * Type definition for the `compute` property of an object.
     *
     * @template T - The type of the `IField` object.
     * @template Payload - The type of the payload used in the `IField` object.
     * @template K - The property key to pick from `IField<Data, Payload>`.
     *
     * @typedef {PickProp<T, 'compute'>} compute
     *
     * @param {IField<Data, Payload>} object - The `IField` object to pick the `compute` property from.
     *
     * @returns {compute} - The value of the `compute` property from the `IField` object.
     */
    compute?: PickProp<IField<Data, Payload>, 'compute'>;
    /**
     * Represents the "click" property of a specific field in a data object.
     *
     * @template Data - The type of the data object containing the field.
     * @template Payload - The type of the payload associated with the click event.
     */
    click?: PickProp<IField<Data, Payload>, 'click'>;
    /**
     * Type definition for the `focus` property with pick properties.
     *
     * The `focus` property is used to pick a specific property from an object type.
     * This type definition is a utility type that leverages Pick and keyof to select
     * the specified property from the provided object type.
     *
     * @template T - The object type from which to pick the property.
     * @template K - The name of the property to select.
     *
     * @typedef PickProp
     * @type {Pick<T, K>}
     */
    focus?: PickProp<IField<Data, Payload>, 'focus'>;
    /**
     * Type definition for the 'blur' property.
     *
     * The 'blur' property is an optional property of type PickProp<IField<Data, Payload>, 'blur'>.
     * It represents whether the field should be blurred or not.
     *
     * @template Data - The data object type.
     * @template Payload - The payload type.
     * @property {(keyof Data | keyof Payload)[]} blur - The properties of the field to be blurred.
     *
     * @typedef {PickProp<IField<Data, Payload>, 'blur'>} BlurType
     */
    blur?: PickProp<IField<Data, Payload>, 'blur'>;
    /**
     * Represents the menuItems property of a field in a form.
     *
     * @typedef {PickProp<IField<Data, Payload>, 'menuItems'>} menuItems
     */
    menuItems?: PickProp<IField<Data, Payload>, 'menuItems'>;
    /**
     * Represents the 'menu' variable.
     *
     * @typedef {PickProp<IField<Data, Payload>, 'menu'>} menu
     * @property {IField<Data, Payload>} - The original field object from which the 'menu' property was picked
     * @property {Payload} menu - The 'menu' property of the field object
     * @property {Data} menu.data - The data associated with the 'menu' property
     * @property {Payload} menu.payload - The payload associated with the 'menu' property
     */
    menu?: PickProp<IField<Data, Payload>, 'menu'>;
    /**
     * Represents a map property of a field.
     *
     * @template Data - The type of data object associated with the field.
     * @template Payload - The type of payload associated with the map property.
     *
     * @typedef {PickProp<IField<Data, Payload>, 'map'>} Map
     *
     * @property {string} key - The key associated with the map property.
     * @property {Payload} value - The value associated with the map property.
     */
    map?: PickProp<IField<Data, Payload>, 'map'>;
    /**
     * Retrieves the defaultValue property from the given field.
     *
     * @param {IField<Data, Payload>} field - The field to get the defaultValue from.
     * @returns {PickProp<IField<Data, Payload>, 'defaultValue'> | undefined} - The defaultValue of the field, if defined.
     */
    defaultValue?: PickProp<IField<Data, Payload>, 'defaultValue'>;
    /**
     * Type definition for the 'hidden' property of a field in a form.
     *
     * @template Data - The type of data object expected by the form.
     * @template Payload - The type of payload expected when submitting the form.
     * @template T - The type of the 'hidden' property in the field.
     *
     * @typedef {PickProp<IField<Data, Payload>, 'hidden'>} hidden
     *
     * @property {T} hidden - The value of the 'hidden' property of the field.
     */
    hidden?: PickProp<IField<Data, Payload>, 'hidden'>;
    /**
     * Extracts the 'features' property from the given variable.
     *
     * @param {IField<Data, Payload>} variable - The variable to pick 'features' property from.
     *
     * @returns {PickProp<IField<Data, Payload>, 'features'>} - The extracted 'features' property.
     */
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
