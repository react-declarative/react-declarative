import FieldType from '../../../model/FieldType';

/**
 * Represents an initial value map for different field types.
 *
 * @typedef initialValueMap
 * @property Checkbox - The initial value for a checkbox field.
 * @property Radio - The initial value for a radio field.
 * @property Text - The initial value for a text field.
 * @property Switch - The initial value for a switch field.
 * @property Progress - The initial value for a progress field.
 * @property Slider - The initial value for a slider field.
 * @property Combo - The initial value for a combo field.
 * @property Items - The initial value for an items field.
 * @property Rating - The initial value for a rating field.
 * @property Typography - The initial value for a typography field.
 * @property Date - The initial value for a date field.
 * @property Time - The initial value for a time field.
 * @property File - The initial value for a file field.
 * @property Choose - The initial value for a choose field.
 * @property Component - The initial value for a component field.
 * @property Complete - The initial value for a complete field.
 * @property Init - The initial value for an init field.
 * @property YesNo - The initial value for a yes/no field.
 * @property Dict - The initial value for a dictionary field.
 * @property Tree - The initial value for a tree field.
 */
const initialValueMap = {
  [FieldType.Checkbox]: false,
  [FieldType.Radio]: null,
  [FieldType.Text]: "",
  [FieldType.Switch]: false,
  [FieldType.Progress]: 1.0,
  [FieldType.Slider]: 0,
  [FieldType.Combo]: null,
  [FieldType.Items]: null,
  [FieldType.Rating]: 3,
  [FieldType.Typography]: '',
  [FieldType.Date]: '',
  [FieldType.Time]: '',
  [FieldType.File]: null,
  [FieldType.Choose]: null,
  [FieldType.Component]: null,
  [FieldType.Complete]: '',
  [FieldType.Init]: null,
  [FieldType.YesNo]: null,
  [FieldType.Dict]: null,
  [FieldType.Tree]: null,
};

type InitialValue = typeof initialValueMap;

/**
 * Returns the initial value based on the specified type.
 *
 * @param type - The type of the initial value.
 * @returns - The initial value.
 */
export const initialValue = (type: FieldType): InitialValue[keyof InitialValue] | string => {
  // @ts-ignore
  const initialValue = initialValueMap[type];
  if (initialValue === undefined) {
    console.warn(`react-declarative One initialValue unknown type ${String(type)}`);
    return undefined as never;
  } else {
    return initialValue;
  }
};

export default initialValue;
