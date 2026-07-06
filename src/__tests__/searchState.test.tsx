import * as React from "react";
import * as ReactDOM from "react-dom";
import { act } from "react-dom/test-utils";

import useSearchState from "../hooks/useSearchState";
import useSearchParams from "../hooks/useSearchParams";

import sleep from "../utils/sleep";

let div: HTMLDivElement;

beforeEach(() => {
    div = document.createElement('div');
    window.history.pushState(null, '', '/');
});

afterEach(() => {
    ReactDOM.unmountComponentAtNode(div);
});

const getSearch = () => new URLSearchParams(window.location.search);

describe('useSearchParams', () => {

    test('Expect float values to be parsed without truncation', () => {
        window.history.pushState(null, '', '/?p_num=1.5&p_int=2&p_flag=true');
        let captured: any = null;
        const Capture = () => {
            captured = useSearchParams({}, 'p');
            return null;
        };
        ReactDOM.render(<Capture />, div);
        expect(captured.num).toBe(1.5);
        expect(captured.int).toBe(2);
        expect(captured.flag).toBe(true);
    });

});

describe('useSearchState', () => {

    test('Expect unmount cleanup to remove own params and keep foreign ones', async () => {
        window.history.pushState(null, '', '/?other=keep');
        const Capture = () => {
            useSearchState({ foo: 42 }, {
                prefix: 'demo',
                updateDelay: 10,
                noCleanupExtra: true,
            });
            return null;
        };
        await act(async () => {
            ReactDOM.render(<Capture />, div);
            await sleep(100);
        });
        expect(getSearch().get('demo_foo')).toBe('42');
        expect(getSearch().get('other')).toBe('keep');

        await act(async () => {
            ReactDOM.unmountComponentAtNode(div);
            await sleep(100);
        });
        expect(getSearch().get('demo_foo')).toBe(null);
        expect(getSearch().get('other')).toBe('keep');
    });

});
