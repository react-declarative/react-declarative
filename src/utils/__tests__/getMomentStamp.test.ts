import dayjs from "dayjs";

import getMomentStamp, { fromMomentStamp } from "../getMomentStamp";
import getTimeStamp, { fromTimeStamp } from "../getTimeStamp";
import getGenesisStamp from "../getGenesisStamp";
import { Date as DateChunk, Time as TimeChunk } from "../datetime";

const DAY_MS = 24 * 60 * 60 * 1_000;

describe('Check getMomentStamp', () => {

    test('Expect stamp to depend only on the calendar date', () => {
        const expected = Date.UTC(2026, 6, 6) / DAY_MS;
        expect(getMomentStamp(dayjs(new Date(2026, 6, 6, 0, 0, 0)))).toBe(expected);
        expect(getMomentStamp(dayjs(new Date(2026, 6, 6, 12, 30, 0)))).toBe(expected);
        expect(getMomentStamp(dayjs(new Date(2026, 6, 6, 23, 59, 59)))).toBe(expected);
        expect(getMomentStamp(dayjs(new Date(2026, 6, 5, 23, 59, 59)))).toBe(expected - 1);
        expect(getMomentStamp(dayjs(new Date(2026, 6, 7, 0, 0, 0)))).toBe(expected + 1);
    });

    test('Expect default argument to use current calendar date', () => {
        const now = new Date();
        const expected = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) / DAY_MS;
        expect(getMomentStamp()).toBe(expected);
    });

    test('Expect fromMomentStamp to be the inverse of getMomentStamp', () => {
        const stamp = Date.UTC(2026, 6, 6) / DAY_MS;
        const moment = fromMomentStamp(stamp);
        expect(moment.format("YYYY-MM-DD")).toBe("2026-07-06");
        expect(getMomentStamp(moment)).toBe(stamp);
    });

    test('Expect genesis stamp to be the unix epoch', () => {
        expect(getGenesisStamp().valueOf()).toBe(0);
    });

});

describe('Check getTimeStamp', () => {

    test('Expect time stamp to be wall-clock minutes', () => {
        expect(getTimeStamp(dayjs(new Date(2026, 6, 6, 13, 45, 0)))).toBe(13 * 60 + 45);
        expect(getTimeStamp(dayjs(new Date(2026, 6, 6, 0, 0, 59)))).toBe(0);
    });

    test('Expect fromTimeStamp to be the inverse of getTimeStamp', () => {
        const moment = fromTimeStamp(13 * 60 + 45);
        expect(moment.hour()).toBe(13);
        expect(moment.minute()).toBe(45);
    });

});

describe('Check datetime stamps', () => {

    test('Expect date stamp to match days since epoch', () => {
        const date = new DateChunk(6, 7, 2026);
        expect(date.toStamp()).toBe(Date.UTC(2026, 6, 6) / DAY_MS);
    });

    test('Expect Date.fromStamp to be the inverse of toStamp', () => {
        const date = new DateChunk(6, 7, 2026);
        const restored = DateChunk.fromStamp(date.toStamp())!;
        expect(restored.day).toBe(6);
        expect(restored.month).toBe(7);
        expect(restored.year).toBe(2026);
    });

    test('Expect Time.fromStamp to restore hours and minutes', () => {
        const time = new TimeChunk(13, 45);
        const restored = TimeChunk.fromStamp(time.toStamp())!;
        expect(restored.hour).toBe(13);
        expect(restored.minute).toBe(45);
    });

});
