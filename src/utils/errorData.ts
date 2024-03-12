/**
 * Extracts the enumerable properties from an Error object and returns them in a new object.
 *
 * @param error - The Error object.
 * @returns - An object containing the enumerable properties of the Error object.
 */
export const errorData = (error: Error) => {
    const propertyNames = Object.getOwnPropertyNames(error);
    const result = {};
    propertyNames.forEach((property) => {
        const descriptor = Object.getOwnPropertyDescriptor(error, property) || {};
        if ('value' in descriptor) {
            result[property] = descriptor.value;
        }
    })
    return result;
};

export default errorData;
