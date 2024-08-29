import getMomentStamp from "../getMomentStamp";
import toUtcDate from "../toUtcDate";

const NOW = new Date();

const STEP = 60 * 60 * 1_000; // 1 second

const START_FROM_LONDON = new Date().getTimezoneOffset() * 60 * 1_000 * -1;

console.log({ START_FROM_LONDON })

const START_OF_DAY = new Date(NOW.getFullYear(), NOW.getMonth(), NOW.getDate(), 0, 1, 0, 0).getTime() + START_FROM_LONDON;
const END_OF_DAY = new Date(NOW.getFullYear(), NOW.getMonth(), NOW.getDate(), 23, 59, 0, 0).getTime();

describe('Check getMomentStamp London dimension', () => {

    let DATE_STAMP: number;
    let EXPECT_MOMENT_STAMP: number;

    beforeAll(() => {
        DATE_STAMP = START_OF_DAY;
        EXPECT_MOMENT_STAMP = getMomentStamp();
        jest.useFakeTimers()
        jest.setSystemTime(toUtcDate(new Date(DATE_STAMP)))
    });

    beforeEach(() => {
        DATE_STAMP += STEP;
        jest.setSystemTime(DATE_STAMP)
    });

    afterAll(() => {
        jest.useRealTimers()
    });

    let iter = 0;

    for (let i = START_OF_DAY; i <= END_OF_DAY; i += STEP) {
        test(`Expect moment stamp to be London`, () => {
            const currentStamp = getMomentStamp();
            const isOk = currentStamp === EXPECT_MOMENT_STAMP;
            console.log(`ok=${isOk} iter=${iter} unix_stamp=${DATE_STAMP} date=${new Date()} current_stamp=${currentStamp} expect_stamp=${EXPECT_MOMENT_STAMP}`);
            iter++;
            expect(isOk).toBeTruthy();
        });
    }

});
