import IAnything from "../model/IAnything";
import IField from "../model/IField";

import getInvalidFields from "./getInvalidFields";

export const getFieldsError = <Data = IAnything, Payload = IAnything>(
    fields: IField<Data, Payload>[],
    data: Data,
    payload: Payload
) => {
    const errors = getInvalidFields(fields, data, payload);
    if (errors) {
        const [{ error }] = errors;
        return error;
    }
    return null;
};

export default getFieldsError;
