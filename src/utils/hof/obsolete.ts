
const RANDOM_CODE = (Math.random() + 1).toString(36).substring(7);
const OBSOLETE_PROMPT = `Method marked as obsolete. Type ${RANDOM_CODE} to continue`;

export const obsolete = <T extends any = any, P extends any[] = any[]>(run: (...args: P) => Promise<T>) => {
    let isPass = false;
    return async (...args: P): Promise<T> => {
        if ('prompt' in window) {
            if (isPass || window.prompt(OBSOLETE_PROMPT) === RANDOM_CODE) {
                isPass = true;
                return await run(...args);
            }
        }
        throw new Error('react-declarative obsolete hof call');
    };
};

export default obsolete;
