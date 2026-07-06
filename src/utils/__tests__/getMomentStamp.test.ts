import dayjs from "dayjs";

import getMomentStamp, { fromMomentStamp } from "../getMomentStamp";

const DAY_MS = 24 * 60 * 60 * 1_000;

describe('Check getMomentStamp London dimension', () => {

    afterEach(() => {
        jest.useRealTimers();
    });

    test('Expect moment stamp to be stable for the whole London day (BST, summer)', () => {
        // London day 2026-07-06 lasts from 2026-07-05T23:00Z to 2026-07-06T23:00Z (UTC+1)
        const startOfLondonDay = Date.UTC(2026, 6, 5, 23, 0, 0);
        const expectedStamp = Date.UTC(2026, 6, 6) / DAY_MS;
        for (let hour = 0; hour !== 24; hour++) {
            const instant = dayjs(startOfLondonDay + hour * 60 * 60 * 1_000);
            expect(getMomentStamp(instant)).toBe(expectedStamp);
        }
        expect(getMomentStamp(dayjs(startOfLondonDay - 1))).toBe(expectedStamp - 1);
        expect(getMomentStamp(dayjs(startOfLondonDay + DAY_MS))).toBe(expectedStamp + 1);
    });

    test('Expect moment stamp to be stable for the whole London day (GMT, winter)', () => {
        // London day 2026-01-06 lasts from 2026-01-06T00:00Z to 2026-01-07T00:00Z (UTC+0)
        const startOfLondonDay = Date.UTC(2026, 0, 6, 0, 0, 0);
        const expectedStamp = Date.UTC(2026, 0, 6) / DAY_MS;
        for (let hour = 0; hour !== 24; hour++) {
            const instant = dayjs(startOfLondonDay + hour * 60 * 60 * 1_000);
            expect(getMomentStamp(instant)).toBe(expectedStamp);
        }
        expect(getMomentStamp(dayjs(startOfLondonDay - 1))).toBe(expectedStamp - 1);
        expect(getMomentStamp(dayjs(startOfLondonDay + DAY_MS))).toBe(expectedStamp + 1);
    });

    test('Expect default argument to use current time', () => {
        jest.useFakeTimers();
        jest.setSystemTime(Date.UTC(2026, 6, 6, 12, 0, 0));
        expect(getMomentStamp()).toBe(Date.UTC(2026, 6, 6) / DAY_MS);
    });

    test('Expect fromMomentStamp to be the inverse of getMomentStamp', () => {
        const summerStamp = Date.UTC(2026, 6, 6) / DAY_MS;
        const winterStamp = Date.UTC(2026, 0, 6) / DAY_MS;
        for (const stamp of [summerStamp, winterStamp]) {
            const moment = fromMomentStamp(stamp);
            expect(getMomentStamp(moment)).toBe(stamp);
            // start of the London day
            expect(getMomentStamp(moment.subtract(1, "millisecond"))).toBe(stamp - 1);
        }
    });

});
