import IAnything from "../../../model/IAnything";
import IField from "../../../model/IField";

import deepFlat from "../../../utils/deepFlat";
import * as datetime from "../../../utils/datetime";
import get from "../../../utils/get";

interface IValidationFn<Data extends IAnything = IAnything> {
    (data: Data): string | null;
}

export const applyValidation = <Data extends IAnything = IAnything, Field extends IField<Data> = IField<Data>>(fields: Field[]): Field[] => {
    for (const field of deepFlat(fields)) {
        const { name, validation } = field;
        const validations: IValidationFn<Data>[] = [];
        if (!name) {
            continue;
        }
        if (!validation) {
            continue;
        }
        const { 
            required, 
            pattern, 
            minLength, 
            maxLength, 
            numeric,
            minNum,
            maxNum,
            date,
            time,
        } = validation;
        if (required) {
            validations.push((data) => {
                const value = get(data, name);
                if (value === false) {
                    return null;
                }
                if (value === 0) {
                    return null;
                }
                if (!value) {
                    return "Required";
                }
                return null;
            });
        }
        if (date) {
            validations.push((data) => {
                if (!datetime.parseDate(get(data, name))?.isValid) {
                    return "The date is invalid";
                }
                return null;
            });
        }
        if (time) {
            validations.push((data) => {
                if (!datetime.parseTime(get(data, name))?.isValid) {
                    return "time date is invalid";
                }
                return null;
            });
        }
        if (numeric) {
            validations.push((data) => {
                if (isNaN(get(data, name))) {
                    return "Must be a number";
                }
                return null;
            });
        }
        if (maxNum) {
            validations.push((data) => {
                if (isNaN(get(data, name))) {
                    return "Must be a number";
                }
                if (parseInt(get(data, name)) > maxNum) {
                    return "Maximum value reached";
                }
                return null;
            });
        }
        if (minNum) {
            validations.push((data) => {
                if (isNaN(get(data, name))) {
                    return "Must be a number";
                }
                if (parseInt(get(data, name)) < minNum) {
                    return "Minimum value reached";
                }
                return null;
            });
        }
        if (pattern) {
            validations.push((data) => {
                const expr = new RegExp(pattern.source, pattern.flags);
                if (!expr.test(get(data, name))) {
                    return 'Pattern does not match';
                }
                return null;
            })
        }
        if (maxLength) {
            validations.push((data) => {
                const count = get(data, name)?.length || 0;
                if (count > maxLength) {
                    return "Maximum length reached";
                }
                return null;
            })
        }
        if (minLength) {
            validations.push((data) => {
                const count = get(data, name)?.length || 0;
                if (count < minLength) {
                    return "Minimum length reached";
                }
                return null;
            })
        }
        if (!field.isInvalid) {
            field.isInvalid = (data) => {
                for (const validation of validations) {
                    const result = validation(data);
                    if (result) {
                        return result;
                    }
                }
                return null;
            }
        }
    }
    return fields;
};


export default applyValidation;
