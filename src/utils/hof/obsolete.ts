import randomString from "../randomString";

const RANDOM_CODE = randomString();
const OBSOLETE_PROMPT = `Method marked as obsolete. Type ${RANDOM_CODE} to continue`;

type Function = (...args: any[]) => any;

const getMethodName = (fn: Function, self: object | undefined): string => {
    if (!self) {
        return "unknown";
    }
    if (typeof self !== 'object') {
        return "unknown";
    }
    for (const key of Object.keys(self)) {
        // @ts-ignore
        if (self[key] === fn) {
            return key;
        }
    }
    return getMethodName(fn, Object.getPrototypeOf(self));
};

export const obsolete = <T extends any = any, P extends any[] = any[]>(run: (...args: P) => Promise<T>) => {
    let methodName = "";
    const fn = async (...args: P): Promise<T> => {
        methodName = methodName || getMethodName(fn, this);
        console.log(`react-declarative obsolete hof call method_name=${methodName}`);
        if ('prompt' in window) {
            if (window.prompt(OBSOLETE_PROMPT) === RANDOM_CODE) {
                return await run(...args);
            }
        }
        throw new Error('react-declarative obsolete hof call');
    };
    return fn;
};

export default obsolete;
