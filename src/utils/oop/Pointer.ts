/**
 * Represents a pointer that can be assigned to another object asynchronously without updating reference.
 *
 * @template T - The type of the object reference.
 * @param ref - The object reference to be assigned.
 * @returns - The pointer object with instance and setPointer methods.
 */
export const createPointer = <T extends object>(ref?: T) => {
    const pointer = new class {
        constructor() {
            ref && Object.setPrototypeOf(this, ref);
        }
    };
    return {
        pointer,
        setPointer(ref: T) {
            Object.setPrototypeOf(pointer, ref);
        }
    };
};

export default createPointer;
