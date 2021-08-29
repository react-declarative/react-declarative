import faker from 'faker';

export const _mock: {
    id: string;
    lastName: string;
    firstName: string;
    age: string;
}[] = [];

export const MOCK_TOTAL = 10_000;

for (let i = 0; i !== MOCK_TOTAL; i++) {
    _mock.push({
        id: i.toString(),
        age: faker.datatype.number().toString(),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
    })
}

export default _mock;
