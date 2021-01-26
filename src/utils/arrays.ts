import isNullOrUndefined from './isNullOrUndefined';

const NUMBER_EXPR = /^\d+$/;

const hasNumberKey = (root: any) => Object.keys(root).find((key) => NUMBER_EXPR.test(key));

export const arrays = (root: any) => {
    let result = root;
    const process = (entry: any, change = (arr: any[]) => result = arr) => {
        if (typeof entry === 'object' && !isNullOrUndefined(entry)) {
            if (hasNumberKey(entry)) {
                change(Object.values(entry));
            } else {
                Object.entries(entry).forEach(([k, v]) => 
                    process(v, (arr) => entry[k] = arr)
                );
            }
        }
    };
    process(root);
    return result;
};

export default arrays;
