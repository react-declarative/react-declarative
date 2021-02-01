import deepCompare from '../deepCompare';
import deepClone from '../deepClone';

import create from '../create';
import set from '../set';

const ULTIMATE_VALUE = Symbol(42);
const H_LEET = Symbol(1337);

const paths = [
    'foo.bar.baz',
    'fizz.buzz',
    'bump.leet',
];

describe('Deep compare object', () => {

    let object: any = null;
    let clone: any = null;

    beforeEach (() => {
        object = {};
        paths.forEach((path) => {
            create(object, path);
            set(object, path, ULTIMATE_VALUE);
        });
        clone = deepClone(object);
    });

    it ('Will mark as equal by default', () => {
        expect(deepCompare(object, clone)).toBeTruthy();
    });

    it ('Will detect external field', () => {
        set(object, 'foo.bar.field', H_LEET);
        expect(deepCompare(object, clone)).toBeFalsy();
    });

    it ('Will detect overwritten value', () => {
        set(object, 'foo.bar.baz', H_LEET);
        expect(deepCompare(object, clone)).toBeFalsy();
    });

    it ('Will work for same object', () => {
        expect(deepCompare(object, object)).toBeTruthy();
    });

});
