import create from '../create';

const ULTIMATE_VALUE = Symbol(42);

interface IObject {
    foo?: {
        bar?: {
            baz?: {
                value?: typeof ULTIMATE_VALUE,
            }
        }
    }
};

describe('Create object path tests', () => {

    let object: IObject;

    beforeEach(() => {
        object = new Object();
    });

    it('Will create path', () => {
        create(object, 'foo.bar.baz.value');
        expect(object?.foo?.bar?.baz).toBeTruthy();
    });

    it('Will not override existing value', () => {
        object = {
            foo: {
                bar: {
                    baz: {
                        value: ULTIMATE_VALUE,
                    }
                }
            }
        }
        create(object, 'foo.bar.baz.value');
        expect(object?.foo?.bar?.baz?.value).toEqual(ULTIMATE_VALUE);
    });
  
});

