import getMomentStamp from "../getMomentStamp";
import toUtcDate from "../toUtcDate";

const NOW = new Date();

const STEP = 1_000; // 1 second

const START_FROM_LONDON = new Date().getTimezoneOffset() * 60 * 1_000 * -1; 
const EXTRA_HOUR = -1 * Math.sign(new Date().getTimezoneOffset()) * 60 * 60 * 1_000;

const START_OF_DAY = new Date(NOW.getFullYear(), NOW.getMonth(), NOW.getDate(), 0, 1, 0, 0).getTime() + START_FROM_LONDON + EXTRA_HOUR;
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

    test(`Expect moment stamp to be London`, () => {
        let iter = 0;
        let isOk = true;
        for (let i = START_OF_DAY; i <= END_OF_DAY; i += STEP) {
            const currentStamp = getMomentStamp();
            isOk = isOk && currentStamp === EXPECT_MOMENT_STAMP;
            iter++;
            if (!isOk) {
                console.log(`Test failed on iter=${iter} unix_stamp=${DATE_STAMP} date=${new Date()} current_stamp=${currentStamp} expect_stamp=${EXPECT_MOMENT_STAMP}`);
                break;
            }
        }
        console.log(`Total: ${iter} iters`);
        expect(isOk).toBe(true);
    });

});
