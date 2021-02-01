import isObject from '../isObject';

class MutationObserver { }
class MediaStream { }
class Date { }

describe ('Detect object as data structure', () => {

    it ('Will not mark function', () => {
        expect(isObject(() => null)).toBeFalsy();
    });

    it ('Will not mark Date or any other object', () => {
        expect(isObject(new Date())).toBeFalsy();
        expect(isObject(new MediaStream())).toBeFalsy();
        expect(isObject(new MutationObserver())).toBeFalsy();
    });

    it ('Will not break on null', () => {
        expect(isObject(Object.create(null))).toBeFalsy();
        expect(isObject(null)).toBeFalsy();
    });

    it ('Will detect data structure', () => {
        expect(isObject(new Object())).toBeTruthy();
        expect(isObject({})).toBeTruthy();
    });

});
