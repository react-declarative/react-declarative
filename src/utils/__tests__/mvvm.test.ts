import Entity from "../mvvm/Entity";
import Collection from "../mvvm/Collection";

interface IItem {
    id: string | number;
    name: string;
    checked?: boolean;
}

describe('mvvm Entity', () => {

    test('Expect partial setData to keep entity id', () => {
        const entity = new Entity<IItem>({ id: 1, name: 'first' });
        entity.setData({ name: 'renamed' });
        expect(entity.id).toBe(1);
        expect(entity.data.name).toBe('renamed');
    });

    test('Expect functional setData to keep entity id', () => {
        const entity = new Entity<IItem>({ id: 'abc', name: 'first' });
        entity.setData(({ name }) => ({ name: `${name}-updated` }));
        expect(entity.id).toBe('abc');
        expect(entity.data.name).toBe('first-updated');
    });

    test('Expect id to be generated for entity without id', () => {
        const entity = new Entity<IItem>({ name: 'orphan' } as IItem);
        entity.setData({ name: 'still orphan' });
        expect(entity.id).not.toBeUndefined();
    });

    test('Expect explicit id in setData to win', () => {
        const entity = new Entity<IItem>({ id: 1, name: 'first' });
        entity.setData({ id: 2 });
        expect(entity.id).toBe(2);
    });

});

describe('mvvm Collection', () => {

    test('Expect findById to keep working after partial entity update', () => {
        const collection = new Collection<IItem>([
            { id: 1, name: 'one' },
            { id: 2, name: 'two' },
        ]);
        collection.findById(1).setData({ checked: true });
        expect(collection.findById(1).data.checked).toBe(true);
        expect(collection.ids).toEqual([1, 2]);
    });

    test('Expect upsert to update existing and append new', () => {
        const collection = new Collection<IItem>([
            { id: 1, name: 'one' },
        ]);
        collection.upsert([
            { id: 1, name: 'one-updated' },
            { id: 2, name: 'two' },
        ]);
        expect(collection.items.length).toBe(2);
        expect(collection.findById(1).data.name).toBe('one-updated');
        expect(collection.findById(2).data.name).toBe('two');
    });

});
