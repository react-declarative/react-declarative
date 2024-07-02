import IInvalidField from "../model/IInvalidField";
import IAnything from "../model/IAnything";
import IField from "../model/IField";

import deepFlat from "./deepFlat";

export const getInvalidFields = <Data = IAnything, Payload = IAnything>(
    fields: IField<Data, Payload>[],
    data: Data,
    payload: Payload
) => {
    const invalid: IInvalidField<Data, Payload>[] = [];
    deepFlat(fields).forEach((field: IField<Data, Payload>) => {
        const { isInvalid = () => null, hidden } = field;
        const isHidden = typeof hidden === 'function' ? hidden(payload) : hidden;
        if (isHidden) {
            return
        }
        const isValid = isInvalid(data, payload) || null;
        if (isValid === null) {
            return;
        }
        invalid.push({
            field,
            error: isValid,
            name: field.name,
            title: field.title,
        });
      });
    return invalid.length ? invalid : null;
};

export default getInvalidFields;
