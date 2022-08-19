import { faker } from '@faker-js/faker';

export const _mock: {
    id: string;
    lastName: string;
    firstName: string;
    chip1_enabled: boolean;
    chip2_enabled: boolean;
    chip3_enabled: boolean;
    color: string;
    age: string;
}[] = [];

export const MOCK_TOTAL = 10_000;

for (let i = 0; i !== MOCK_TOTAL; i++) {
    _mock.push({
        id: i.toString(),
        age: faker.datatype.number().toString(),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        chip1_enabled: faker.datatype.number(3) === 0,
        chip2_enabled: faker.datatype.number(3) === 1,
        chip3_enabled: faker.datatype.number(3) === 2,
        color: faker.datatype.number(3) % 2 === 0 ? 'green' : 'red',
    })
}

export default _mock;
