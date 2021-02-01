import * as React from "react";
import ReactDOM from "react-dom";

import OneForm from '../components/One';

import IOneProps from "../model/IOneProps";
import TypedField from "../model/TypedField";
import FieldType from "../model/FieldType";
import IField from "../model/IField";

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

describe('Strict fields set', () => {
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
});
