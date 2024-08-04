import FieldType from "../../../model/FieldType";
import IField from "../../../model/IField";

import { isLayout } from "./isStatefull";

/**
 * Set of FieldType values representing the baseline fields.
 */
export const baselineFields = new Set<FieldType>([
    FieldType.Choose,
    FieldType.Combo,
    FieldType.Complete,
    FieldType.Date,
    FieldType.File,
    FieldType.Items,
    FieldType.Text,
    FieldType.Time,
    FieldType.Dict,
    FieldType.Tree,
    FieldType.Button,
    FieldType.Icon,
]);

/**
 * Для поля нужно проверить флаги и наличие в списке. Флаги baseline компоновок
 * действуют только на потомков и на родительский элемент не распространяются
 */
export const isBaselineForField = (field: IField) => {
    if (field.type === FieldType.Fragment) {
        return isBaselineForLayout(field);
    }
    if (isLayout(field.type)) {
        return false;
    }
    if (field.outlined) {
        return false;
    }
    if (field.noBaseline) {
        return false;
    }
    if (field.baseline) {
        return true;
    }
    return baselineFields.has(field.type);
}

/**
 * Для компоновки все дочерние поля должны быть не компоновками
 * на один уровень вложенности без рекурсии
 *                             ^^^^^^^^^^^^
 */
const isBaselineForLayout = ({ outlined, noBaseline, baseline, child, fields }: IField): boolean => {
    if (outlined) {
        return false;
    } 
    if (noBaseline) {
        return false;
    }
    if (baseline) {
        return true;
    }
    const innerFields: IField[] = child
        ? [child]
        : fields || [];
    return innerFields.some(isBaselineForField);
};

export const isBaseline = (field: IField) => {
    if (isLayout(field.type)) {
        return isBaselineForLayout(field)
    }
    return isBaselineForField(field);
}

export default isBaseline;
