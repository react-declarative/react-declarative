/**
 * Interface representing validation options for a form field.
 * @interface
 * @property [required] - Indicates if the field is required or not.
 * @property [minLength] - Minimum length required for the field value.
 * @property [maxLength] - Maximum length allowed for the field value.
 * @property [pattern] - Regular expression pattern for validating the field value.
 */
export interface IValidation {
    required?: boolean;
    numeric?: boolean;
    minLength?: number;
    maxLength?: number;
    minNum?: number;
    maxNum?: number;
    pattern?: RegExp;
}

export default IValidation;
