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
