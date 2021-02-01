import deepMerge from '../deepMerge';
import deepClone from '../deepClone';

import create from '../create';
import get from '../get';
import set from '../set';

const H_ULTIMATE = Symbol(42);
const H_LEET = Symbol(1337);

const obj1_paths = [
    'foo.bar.baz',
    'fizz.buzz',
    'leet',
];

const obj2_paths = [
    'foo.sample.path',
    'amazing.path',
    'leet',
];

const merged_paths = [
    ...obj1_paths,
    ...obj2_paths,
];

const createObject = (paths: string[], value: any) => {
    const object = {};
    paths.forEach((path) => {
        create(object, path);
        set(object, path, value);
    });
    return deepClone(object);
};

describe('Deep merge object', () => {

    let obj1: any = null;
    let obj2: any = null;
    let merged: any = null;

    beforeEach(() => {
        obj1 = createObject(obj1_paths, H_ULTIMATE);
        obj2 = createObject(obj2_paths, H_LEET);
        deepMerge(merged = {}, obj1, obj2);
    });

    it ('Will not do shallow merge', () => {
        expect(get(merged, 'foo.bar.baz')).toBeTruthy();
        expect(get(merged, 'foo.sample.path')).toBeTruthy();
    });

    it ('Will process all entries', () => {
        merged_paths.forEach((path) => 
            expect(get(merged, path)).toBeTruthy()
        );
    });

    it ('Will overwrite values', () => {
        expect(get(obj1, 'leet')).toEqual(H_ULTIMATE);
        expect(get(obj2, 'leet')).toEqual(H_LEET);
        expect(get(merged, 'leet')).toEqual(H_LEET);
    });

});
