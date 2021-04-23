import range from '../range';

describe ('Generate range with python compability', () => {

    it ('Will work as expected', () => {
        const created = range(0, 10);
        const { length } = created;
        const [ first ] = created;
        const [ last ] = created.reverse();
        expect(first).toBe(0);
        expect(last).toBe(9);
        expect(length).toBe(10);
    });

});
