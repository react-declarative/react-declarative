import promiseState, { promiseValue } from "../promiseState";
import formatAmount from "../formatAmount";
import wordForm from "../wordForm";
import normalizeText from "../normalizeText";
import toRouteUrl from "../toRouteUrl";
import { nbsp } from "../typo";

describe('promiseState / promiseValue', () => {

    test('Expect sync values to be reported synchronously', () => {
        expect(promiseState(42)).toBe('sync');
        expect(promiseValue(42)).toBe(42);
        expect(promiseValue(false as unknown as number)).toBe(false);
    });

    test('Expect promises to be reported as async', () => {
        expect(promiseState(Promise.resolve(42))).toBe('async');
        expect(promiseValue(Promise.resolve(42))).toBe(null);
    });

});

describe('formatAmount', () => {

    test('Expect trailing zero decimals to be stripped only after the point', () => {
        expect(formatAmount(5)).toBe('5');
        expect(formatAmount(1200, 0)).toBe('1200');
        expect(formatAmount(100, 0)).toBe('100');
    });

    test('Expect thousands to be separated', () => {
        expect(formatAmount(1234567.5)).toBe(`1${nbsp}234${nbsp}567,50`);
    });

});

describe('wordForm', () => {

    const forms = { one: 'день', two: 'дня', many: 'дней' };

    test('Expect base plural forms', () => {
        expect(wordForm(1, forms)).toBe('1 день');
        expect(wordForm(2, forms)).toBe('2 дня');
        expect(wordForm(5, forms)).toBe('5 дней');
        expect(wordForm(11, forms)).toBe('11 дней');
        expect(wordForm(0, forms)).toBe('0 дней');
    });

    test('Expect teens handling to work for values above 100', () => {
        expect(wordForm(111, forms)).toBe('111 дней');
        expect(wordForm(112, forms)).toBe('112 дней');
        expect(wordForm(121, forms)).toBe('121 день');
        expect(wordForm(122, forms)).toBe('122 дня');
        expect(wordForm(1011, forms)).toBe('1011 дней');
    });

});

describe('normalizeText', () => {

    test('Expect template to be applied', () => {
        expect(normalizeText('79993334455', {
            inputFormatterTemplate: '+0 (000) 000-00-00',
        })).toBe('+7 (999) 333-44-55');
    });

    test('Expect non-string input to produce empty string', () => {
        expect(normalizeText(null as unknown as string)).toBe('');
        expect(normalizeText(undefined as unknown as string)).toBe('');
    });

});

describe('toRouteUrl', () => {

    test('Expect params to be url-encoded', () => {
        expect(toRouteUrl('/user/:id', { id: 'foo bar' })).toBe('/user/foo%20bar');
        expect(toRouteUrl('/user/:id', { id: '42' })).toBe('/user/42');
    });

});
