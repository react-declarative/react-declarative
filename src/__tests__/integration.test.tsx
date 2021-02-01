import * as React from "react";
import * as ReactDOM from "react-dom";

// import { act } from 'react-dom/test-utils';

import OneForm from '../components/One';

import IOneProps from "../model/IOneProps";
import TypedField from "../model/TypedField";
import FieldType from "../model/FieldType";
import IField from "../model/IField";

jest.setTimeout(30_000);

jest.mock('react', () => ({
    ...jest.requireActual<any>('react'),
    useState: (initialValue: any) => {
        const { act } = jest.requireActual('react-dom/test-utils');
        const [value, setValue] = jest.requireActual('react').useState(initialValue);
        return [value, (newValue: any) => act(() => setValue(newValue))];
    }
}));

const HELLO_THERE = 'Hello there!';

let div: HTMLDivElement;

function render(props: IOneProps<IField>) {
    ReactDOM.render(<OneForm {...props}/>, div);
}

function renderStrict(props: IOneProps<TypedField>) {
    return render(props);
}

beforeEach(() => {
    div = document.createElement('div');
});

afterEach(() => {
    ReactDOM.unmountComponentAtNode(div);
});

describe ('Strict fields set', () => {

    it ('Renders without crashing', (done) => {
        renderStrict({
            fields: [
                {
                    type: FieldType.Text,
                    title: HELLO_THERE,
                }
            ],
            ready() {
                expect(div.innerHTML).toContain(HELLO_THERE);
                done();
            }
        });
    });

    it ('Can bubble ready event from fields which \
        wrapped by group-in-group (passthrought)', 
        (done) => {
            renderStrict({
                fields: [
                    {
                        type: FieldType.Group,
                        fields: [
                                {
                                    type: FieldType.Group,
                                    fields: [
                                        {
                                            type: FieldType.Text,
                                            title: HELLO_THERE,
                                        }
                                    ]
                                }
                        ]
                    }
                ],
                ready() {
                    expect(div.innerHTML).toContain(HELLO_THERE);
                    done();
                }
            }) 
        }
    );

    it ('Will deep merge default values with promise', (done) => {
        renderStrict({
            handler: () => Promise.resolve({
                foo: {
                    bar: '1'
                }
            }),
            fields: [
                {
                    type: FieldType.Group,
                    fields: [
                        {
                            type: FieldType.Text,
                            name: 'foo.baz',
                            defaultValue: '2',
                        }
                    ]
                }
            ],
            change({foo: {bar, baz}}) {
                try {
                    expect.assertions(2);
                    expect(bar).toBe('1');
                    expect(baz).toBe('2');
                } finally {
                    done();
                }
            }
        })
    });

    it ('Will deep merge default values with function', (done) => {
        renderStrict({
            handler: () => ({
                foo: {
                    bar: '1'
                }
            }),
            fields: [
                {
                    type: FieldType.Group,
                    fields: [
                        {
                            type: FieldType.Text,
                            name: 'foo.baz',
                            defaultValue: '2',
                        }
                    ]
                }
            ],
            change({foo: {bar, baz}}) {
                try {
                    expect.assertions(2);
                    expect(bar).toBe('1');
                    expect(baz).toBe('2');
                } finally {
                    done();
                }
            }
        })
    });

    it ('Will not overwrite function result by default values', (done) => {
        renderStrict({
            handler: () => ({
                foo: {
                    bar: '1'
                }
            }),
            fields: [
                {
                    type: FieldType.Group,
                    fields: [
                        {
                            type: FieldType.Text,
                            name: 'foo.bar',
                            defaultValue: '2',
                        }
                    ]
                }
            ],
            change({foo: {bar}}) {
                try {
                    expect.assertions(1);
                    expect(bar).toBe('1');
                } finally {
                    done();
                }
            }
        })
    });

});
