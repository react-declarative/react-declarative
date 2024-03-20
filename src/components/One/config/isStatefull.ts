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

export const isLayout = (type: FieldType) => layouts.has(type);

/**
 * Компоновки работают как stateless, нам не нужно дожидаться
 * инициализации состояния
 */
export const isStatefull = ({type, name}: IField) => name && !layouts.has(type);

export default isStatefull;
