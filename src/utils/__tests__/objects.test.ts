import objects from '../objects';

import get from '../get';

import isObject from '../isObject';

const H_LEET = Symbol(1337);
const H_BUZZ = Symbol('buzz');

describe('Detect array by object keys', () => {

    let entry: any = null;

    beforeEach(() => {
        entry = objects({
            foo: [{ bar: [H_LEET, [H_BUZZ]] }, 1],
        });
    });

    it ('Will patch root object', () => {
        expect(isObject(objects([]))).toBeTruthy();
    });

    it ('Will patch arrays', () => {
        expect(Array.isArray(get(entry, 'foo'))).toBeFalsy();
        expect(Array.isArray(get(entry, 'foo.0.bar'))).toBeFalsy();
        expect(Array.isArray(get(entry, 'foo.0.bar.1'))).toBeFalsy();
    });

    it ('Will patch only by need', () => {
        expect(get(entry, 'foo.0.bar.0')).toBe(H_LEET);
        expect(get(entry, 'foo.0.bar.1.0')).toBe(H_BUZZ);
    });

});
