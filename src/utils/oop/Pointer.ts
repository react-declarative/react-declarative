/**
 * Represents a pointer that can be assigned to another object asynchronously without updating reference.
 *
 * @template T - The type of the object reference.
 * @param ref - The object reference to be assigned.
 * @returns - The pointer object with instance and setPointer methods.
 */
export const createPointer = <T extends object>(ref?: T) => {
    const instance = new class {
        constructor() {
            ref && Object.setPrototypeOf(this, ref);
        }
    };
    return {
        instance,
        setPointer(ref: T) {
            Object.setPrototypeOf(instance, ref);
        }
    };
};

export default createPointer;
