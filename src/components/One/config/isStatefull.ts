import FieldType from '../../../model/FieldType';
import IField from '../../../model/IField';

/**
 * Represents a set of FieldType layouts.
 */
const layouts: Set<FieldType> = new Set([
    FieldType.Group,
    FieldType.Box,
    FieldType.Paper,
    FieldType.Outline,
    FieldType.Expansion,
    FieldType.Div,
    FieldType.Tabs,
    FieldType.Hero,
    FieldType.Fragment,
    FieldType.Center,
    FieldType.Stretch,
    FieldType.Condition,
    FieldType.Layout,
]);

/**
 * Checks if a given FieldType is a layout type.
 *
 * @param type - The FieldType to check.
 * @returns - Returns true if the FieldType is a layout type, otherwise false.
 */
export const isLayout = (type: FieldType) => layouts.has(type);

/**
 * Компоновки работают как stateless, нам не нужно дожидаться
 * инициализации состояния
 */
export const isStatefull = ({type, name}: IField) => name && !layouts.has(type);

export default isStatefull;
