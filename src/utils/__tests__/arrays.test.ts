import arrays from '../arrays';

const H_LEET = Symbol(1337);
const H_BUZZ = Symbol('buzz');

describe ('Detect array by object keys', () => {

    it ('Will patch root object', () => {
        expect(Array.isArray(arrays({0: 'aaa'}))).toBeTruthy();
    });

    it ('Will patch every object by need', () => {
        const entry = arrays({
            foo: {
                0: { 
                    bar: {
                        fizz: {
                            0: H_BUZZ,
                            object: new Date(),
                        },
                        0: H_LEET,
                    }
                },
                value: 1,
            },
        });
        expect(entry.foo.length).toBeTruthy();
        expect(entry.foo[0].length).toBeFalsy();
        expect(entry.foo[0].bar[0]).toBe(H_LEET);
        expect(entry.foo[0].bar[1].includes(H_BUZZ)).toBeTruthy();
        expect(entry.foo[0].bar[1].find(
            (v: any) => v instanceof Date).getTime()
        ).toBeTruthy();
    });

});

