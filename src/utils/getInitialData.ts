import initialValue from "../components/One/config/initialValue";

import deepFlat from "./deepFlat";
import create from "./create";
import get from "./get";
import set from "./set";

import FieldType from "../model/FieldType";
import IAnything from "../model/IAnything";
import IField from "../model/IField";

/**
 * Generates initial data based on provided field definitions and payload.
 *
 * @template Data - The type of data object to create.
 * @template Payload - The type of payload used for populating default values.
 *
 * @param fields - The array of field definitions.
 * @param [payload={}] - The payload object used for populating default values.
 *
 * @returns - The generated initial data object.
 */
export const getInitialData = <Data extends {} = IAnything, Payload extends IAnything = IAnything>(
    fields: IField<Data, Payload>[], payload: Payload = {} as Payload
) => {
    const newData: Partial<Data> = {};
    deepFlat(fields)
        .filter(({ name }) => !!name)
        .filter(({ type }) => type !== FieldType.Phony)
        .filter(({ type }) => type !== FieldType.Button)
        .filter(({ type }) => type !== FieldType.Icon)
        .forEach(({ type, name, defaultValue, hidden }) => {
            create(newData, name);
            if (typeof hidden === 'function' ? hidden(payload) : hidden) {
                return;
            } else if (typeof defaultValue === 'undefined') {
                set(newData, name, get(newData, name) || initialValue(type));
            } else if (typeof defaultValue === 'function') {
                set(newData, name, (defaultValue as Function)(payload));
            } else {
                set(newData, name, defaultValue);
            }
        });
    return newData as Data;
};

export default getInitialData;
