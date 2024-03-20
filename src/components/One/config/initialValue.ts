import FieldType from '../../../model/FieldType';

/**
 * Represents an initial value map for different field types.
 *
 * @typedef {Object} initialValueMap
 * @property {boolean} Checkbox - The initial value for a checkbox field.
 * @property {null} Radio - The initial value for a radio field.
 * @property {string} Text - The initial value for a text field.
 * @property {boolean} Switch - The initial value for a switch field.
 * @property {number} Progress - The initial value for a progress field.
 * @property {number} Slider - The initial value for a slider field.
 * @property {null} Combo - The initial value for a combo field.
 * @property {null} Items - The initial value for an items field.
 * @property {number} Rating - The initial value for a rating field.
 * @property {string} Typography - The initial value for a typography field.
 * @property {string} Date - The initial value for a date field.
 * @property {string} Time - The initial value for a time field.
 * @property {null} File - The initial value for a file field.
 * @property {null} Choose - The initial value for a choose field.
 * @property {null} Component - The initial value for a component field.
 * @property {string} Complete - The initial value for a complete field.
 * @property {null} Init - The initial value for an init field.
 * @property {null} YesNo - The initial value for a yes/no field.
 * @property {null} Dict - The initial value for a dictionary field.
 * @property {null} Tree - The initial value for a tree field.
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

export const initialValue = (type: FieldType): InitialValue[keyof InitialValue] | string => {
  const initialValue = initialValueMap[type];
  if (initialValue === undefined) {
    console.warn(`react-declarative One initialValue unknown type ${type}`);
    return '';
  } else {
    return initialValue;
  }
};

export default initialValue;
