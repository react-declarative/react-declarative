import set from '../set';

import create from '../create';
import get from '../get';

const H_ULTIMATE = Symbol(42);
const H_LEET = Symbol(1337);

const paths = [
    'foo.bar.baz',
];

interface IObject {
    foo?: {
        bar: {
            baz: typeof H_ULTIMATE;
        }
    }
}

let object: IObject;

describe('Set object field by path', () => {

    beforeEach(() => {
        object = new Object();
        paths.forEach((path) => {
            create(object, path);
            set(object, path, H_ULTIMATE);
        });
    });

    it ('Will alert on broken path', () => {
        expect(set(object, 'fizz.buz', H_LEET)).toBeFalsy();
    });

    it ('Will update value', () => {
        paths.forEach((path) => {
            set(object, path, H_LEET);
            expect(get(object, path)).toEqual(H_LEET);
        });
    });

});
