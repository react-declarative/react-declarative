import get from '../get';

import create from '../create';
import set from '../set';

const H_ULTIMATE = Symbol(42);

const paths = [
    'foo.bar.baz',
];

interface IObject {
    foo?: {
        bar: {
            baz: typeof H_ULTIMATE;
        }
    }
};

describe('Get object field by path', () => {

    let object: IObject;

    beforeEach(() => {
        object = new Object();
        paths.forEach((path) => {
            create(object, path);
            set(object, path, H_ULTIMATE);
        });
    });

    it ('Will not fail on unknown property', () => {
        expect(get(object, 'fizz.buzz')).toBeUndefined();
        expect(get(object, 'foo.baz')).toBeUndefined();
    });

    it ('Will recieve H_ULTIMATE', () => {
        expect(get(object, 'foo.bar.baz')).toEqual(H_ULTIMATE);
    });

});
