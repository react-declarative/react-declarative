import IAnything from "../model/IAnything";
import IField from "../model/IField";

import getInvalidFields from "./getInvalidFields";

export const isInvalidFieldData = <Data = IAnything, Payload = IAnything>(
    fields: IField<Data, Payload>[],
    data: Data,
    payload: Payload,
    fallback?: (error: string, title: string | undefined, name: string | undefined) => void
) => {
    const errors = getInvalidFields(fields, data, payload);
    if (errors) {
        const [{ error, title, name }] = errors;
        fallback && fallback(error, title, name);
        return true;
    }
    return false;
};

export default isInvalidFieldData;
