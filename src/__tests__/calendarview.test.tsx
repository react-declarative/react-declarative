import * as React from "react";
import * as ReactDOM from "react-dom";
import { act } from "react-dom/test-utils";
import dayjs from "dayjs";

import CalendarView from "../components/CalendarView";
import ICalendarRequest from "../components/CalendarView/model/ICalendarRequest";

import getMomentStamp from "../utils/getMomentStamp";
import sleep from "../utils/sleep";

jest.setTimeout(30_000);

jest.mock('react', () => ({
    ...jest.requireActual<any>('react'),
    useState: (initialValue: any) => {
        const { act } = jest.requireActual('react-dom/test-utils');
        const [value, setValue] = jest.requireActual('react').useState(initialValue);
        return [value, (newValue: any) => act(() => setValue(newValue))];
    }
}));

let div: HTMLDivElement;

const RenderItem = (props: any) => (
    <span>{props.title || 'unknown-task'}</span>
);

const commonProps = {
    renderItem: RenderItem,
    onItemClick: () => undefined,
} as const;

class ResizeObserverMock {
    observe() {}
    unobserve() {}
    disconnect() {}
}

beforeAll(() => {
    (globalThis as any).ResizeObserver = (globalThis as any).ResizeObserver || ResizeObserverMock;
    CalendarView.init();
});

beforeEach(() => {
    div = document.createElement('div');
    document.body.appendChild(div);
});

afterEach(() => {
    ReactDOM.unmountComponentAtNode(div);
    document.body.removeChild(div);
    document.body.innerHTML = '';
});

describe('CalendarView on get-moment-stamp api', () => {

    test('Expect request range to bracket today and items to match the day cell', async () => {
        const today = dayjs();
        const todayStamp = getMomentStamp(today);

        let capturedRequest: ICalendarRequest | null = null;

        const handler = jest.fn(async (request: ICalendarRequest) => {
            capturedRequest = request;
            return [{
                data: { id: 1, title: 'test-task' },
                payload: {},
                stamp: todayStamp,
            }];
        });

        await act(async () => {
            ReactDOM.render(<CalendarView {...commonProps} handler={handler} />, div);
            await sleep(100);
        });

        // запрос диапазона: стамп сегодняшнего дня внутри [fromStamp..toStamp]
        expect(handler).toHaveBeenCalled();
        expect(capturedRequest).not.toBeNull();
        expect(capturedRequest!.fromStamp).toBeLessThanOrEqual(todayStamp);
        expect(capturedRequest!.toStamp).toBeGreaterThanOrEqual(todayStamp);
        // календарная сетка месяца: 4-6 недель
        const span = capturedRequest!.toStamp - capturedRequest!.fromStamp + 1;
        expect(span % 7).toBe(0);
        expect(span).toBeGreaterThanOrEqual(28);
        expect(span).toBeLessThanOrEqual(42);

        // ячейка текущего дня подсвечена
        const todayButton = div.querySelector<HTMLButtonElement>('button[class*="buttonAccient"]');
        expect(todayButton).not.toBeNull();
        expect(todayButton!.textContent).toContain(today.format("DD"));

        // клик по ячейке открывает popover; подзаголовок с датой рендерится
        // только когда items смэтчились по стампу (иначе — заглушка)
        await act(async () => {
            todayButton!.click();
            await sleep(100);
        });

        expect(document.body.textContent).toContain(today.format("DD/MM/YYYY"));
        expect(document.body.textContent).not.toContain("На этот день задач не назначено");
    });

    test('Expect day cell of another date to have no items', async () => {
        const today = dayjs();
        const todayStamp = getMomentStamp(today);

        const handler = jest.fn(async () => [{
            data: { id: 1 },
            payload: {},
            // задача на "вчера": в ячейку сегодняшнего дня попасть не должна
            stamp: todayStamp - 1,
        }]);

        await act(async () => {
            ReactDOM.render(<CalendarView {...commonProps} handler={handler} />, div);
            await sleep(100);
        });

        const todayButton = div.querySelector<HTMLButtonElement>('button[class*="buttonAccient"]');
        expect(todayButton).not.toBeNull();

        await act(async () => {
            todayButton!.click();
            await sleep(100);
        });

        expect(document.body.textContent).toContain("На этот день задач не назначено");
    });

    test('Expect header slots to receive the range of the newly selected month', async () => {
        let capturedRequest: ICalendarRequest | null = null;
        let slotStamps: { fromStamp: number; toStamp: number } | null = null;

        const handler = jest.fn(async (request: ICalendarRequest) => {
            capturedRequest = request;
            return [];
        });

        const BeforeCalendarHeader = ({ fromStamp, toStamp }: { fromStamp: number; toStamp: number }) => {
            slotStamps = { fromStamp, toStamp };
            return null;
        };

        await act(async () => {
            ReactDOM.render(
                <CalendarView
                    {...commonProps}
                    handler={handler}
                    BeforeCalendarHeader={BeforeCalendarHeader}
                />,
                div,
            );
            await sleep(100);
        });

        // на маунте слот видит тот же диапазон, что и запрос
        expect(slotStamps).not.toBeNull();
        const initialStamps = { ...slotStamps! };
        expect(initialStamps.fromStamp).toBe(capturedRequest!.fromStamp);
        expect(initialStamps.toStamp).toBe(capturedRequest!.toStamp);

        // листаем на следующий месяц
        const nextButton = div
            .querySelector('svg[data-testid="KeyboardArrowRightIcon"]')!
            .closest('button')!;
        await act(async () => {
            nextButton.click();
            await sleep(100);
        });

        // запрос ушёл на новый месяц, слот обязан видеть новый диапазон, не диапазон маунта
        expect(capturedRequest!.fromStamp).toBeGreaterThan(initialStamps.fromStamp);
        expect(slotStamps!.fromStamp).toBe(capturedRequest!.fromStamp);
        expect(slotStamps!.toStamp).toBe(capturedRequest!.toStamp);
    });

    test('Expect props changes after mount to reach consumers', async () => {
        const handler = jest.fn(async () => []);
        const MarkerA = () => <span>marker-a</span>;
        const MarkerB = () => <span>marker-b</span>;

        await act(async () => {
            ReactDOM.render(
                <CalendarView {...commonProps} handler={handler} BeforeCalendarHeader={MarkerA} />,
                div,
            );
            await sleep(100);
        });
        expect(div.textContent).toContain('marker-a');

        // смена пропа после маунта: контекст обязан отдать консюмерам новое значение
        await act(async () => {
            ReactDOM.render(
                <CalendarView {...commonProps} handler={handler} BeforeCalendarHeader={MarkerB} />,
                div,
            );
            await sleep(100);
        });
        expect(div.textContent).toContain('marker-b');
        expect(div.textContent).not.toContain('marker-a');
    });

});
