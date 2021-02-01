import deepClone from '../deepClone';

import create from '../create';
import get from '../get';
import set from '../set';

const ULTIMATE_VALUE = Symbol(42);

const paths = [
    'foo.bar.baz',
    'fizz.buzz',
    'bump.leet',
];

describe('Deep clone object', () => {

    let object: any = null;
    let clone: any = null;

    beforeEach(() => {
        object = {};
        paths.forEach((path) => {
            create(object, path);
            set(object, path, ULTIMATE_VALUE);
        });
        clone = deepClone(object);
    });

    it('Will not create shallow copy', () => {
        paths.map((path) => path.slice(0, path.lastIndexOf('.')))
            .forEach((path) => {
                expect(get(object, path)).not.toBe(get(clone, path));
            });
    });

    it('Will not break values', () => {
        paths.forEach((path) => {
            expect(get(object, path)).toBe(get(clone, path));
        });
    });

});
