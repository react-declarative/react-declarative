import randomString from "../randomString";

const RANDOM_CODE = randomString();
const OBSOLETE_PROMPT = `Method marked as obsolete. Type ${RANDOM_CODE} to continue`;

export const obsolete = <T extends any = any, P extends any[] = any[]>(run: (...args: P) => Promise<T>) => {
    return async (...args: P): Promise<T> => {
        if ('prompt' in window) {
            if (window.prompt(OBSOLETE_PROMPT) === RANDOM_CODE) {
                return await run(...args);
            }
        }
        throw new Error('react-declarative obsolete hof call');
    };
};

export default obsolete;
