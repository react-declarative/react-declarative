import OneConfigInstance from './OneConfigInstance';

export const GET_REF_SYMBOL = Symbol('get-reference');

export class OneConfig {
    private static readonly instance = new OneConfigInstance();
    public static [GET_REF_SYMBOL] = OneConfig.instance.getRef;
    public static setValue = OneConfig.instance.setValue;
}

export default OneConfig;
