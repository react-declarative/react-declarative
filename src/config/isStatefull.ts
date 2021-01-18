import FieldType from '../model/FieldType';
import IField from '../model/IField';

const layouts: FieldType[] = [
    FieldType.Group,
    FieldType.Paper,
    FieldType.Expansion,
];

/**
 * Компоновки работают как stateless, нам не нужно дожидаться
 * инициализации состояния
 */
export const isStatefull = ({type, name}: IField) => name && !layouts.includes(type);

export default isStatefull;
